function NR({ id: t, back: e }) {
  let a = Y(),
    r = a.edu?.courses.find((m) => m.id === t),
    o = a.eduMine?.enr.find((m) => m.course === t),
    [n, i] = (0, ra.useState)(null),
    [s, l] = (0, ra.useState)(null),
    [c, d] = (0, ra.useState)(!1),
    h = o?.cert ? a.eduMine?.certs.find((m) => m.code === o.cert) : void 0;
  if (
    ((0, ra.useEffect)(
      () =>
        O.on("edu_wrong", (m) => {
          m.course === t && d(!0);
        }),
      [t],
    ),
    (0, ra.useEffect)(() => {
      (l(null), d(!1));
    }, [n]),
    (0, ra.useEffect)(() => {
      if (r && o && n !== null && o.done.includes(n)) {
        let m = r.lessons.findIndex((f, y) => !o.done.includes(y));
        m >= 0 && m !== n && setTimeout(() => i(m), 600);
      }
    }, [o?.done.length]),
    !r)
  )
    return (0, A.jsxs)("div", {
      className: "text-sm",
      children: [
        (0, A.jsxs)("button", {
          className: "btn btn-ghost btn-sm",
          onClick: e,
          children: [(0, A.jsx)(Qr, {}), " Back"],
        }),
        " ",
        (0, A.jsx)("span", { style: Me, children: "Loading\u2026" }),
      ],
    });
  let u = r.teacher === a.net.id,
    p = () => {
      if (r.fee && (a.wallets[a.session.userId] || 0) < r.fee)
        return F(`You need ${q(r.fee)} for this course.`, "warn");
      (O.send({ t: "edu_enroll", course: r.id }),
        F(
          r.fee
            ? `Enrolling: ${q(r.fee)} paid through the Central Bank (90% to the teacher).`
            : "Enrolled. Start with lesson 1.",
          "ok",
        ));
    },
    v = (m) => {
      if ((d(!1), r.lessons[m].q && s === null)) return F("Choose an answer first.", "warn");
      O.send({ t: "edu_done", course: r.id, lesson: m, answer: s ?? void 0 });
    },
    g = o ? Math.round((o.done.length / r.lessons.length) * 100) : 0;
  if (n !== null) {
    let m = r.lessons[n],
      f = o?.done.includes(n);
    return (0, A.jsxs)("div", {
      className: "space-y-2",
      children: [
        (0, A.jsxs)("button", {
          className: "btn btn-ghost btn-sm",
          onClick: () => i(null),
          children: [(0, A.jsx)(Qr, {}), " ", r.title],
        }),
        (0, A.jsxs)("div", {
          className: "card p-3",
          children: [
            (0, A.jsxs)("div", {
              className: "text-[11px]",
              style: Me,
              children: ["Lesson ", n + 1, " of ", r.lessons.length],
            }),
            (0, A.jsx)("div", { className: "text-base font-bold", children: m.title }),
            (0, A.jsx)("div", {
              className: "text-[13px] mt-2 whitespace-pre-wrap leading-relaxed",
              children: m.body,
            }),
            m.video &&
              (0, A.jsxs)("a", {
                className: "btn btn-ghost btn-sm mt-2",
                href: m.video,
                target: "_blank",
                rel: "noopener noreferrer",
                children: [(0, A.jsx)(sE, {}), " Watch the video"],
              }),
            m.q &&
              m.opts &&
              (0, A.jsxs)("div", {
                className: "mt-3",
                children: [
                  (0, A.jsxs)("div", {
                    className: "text-[13px] font-bold",
                    children: ["Quick check: ", m.q],
                  }),
                  (0, A.jsx)("div", {
                    className: "space-y-1 mt-1",
                    children: m.opts.map((y, x) =>
                      (0, A.jsx)(
                        "button",
                        {
                          "data-opt": x,
                          className: "w-full text-left rounded-md px-2.5 py-1.5 text-[13px]",
                          style: {
                            border: `1px solid ${s === x ? "var(--accent)" : "var(--line)"}`,
                            background:
                              s === x ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "transparent",
                          },
                          onClick: () => {
                            (l(x), d(!1));
                          },
                          children: y,
                        },
                        x,
                      ),
                    ),
                  }),
                  c &&
                    (0, A.jsx)("div", {
                      className: "text-[12px] mt-1",
                      style: { color: "var(--rose)" },
                      children: "Not quite. Read the lesson again and try another answer.",
                    }),
                ],
              }),
            (0, A.jsx)("div", {
              className: "mt-3",
              children: f
                ? (0, A.jsxs)("span", {
                    className: "text-[13px] font-bold",
                    style: { color: "#45e0ae" },
                    children: [(0, A.jsx)(_e, { className: "inline" }), " Done"],
                  })
                : (0, A.jsx)("button", {
                    id: "lesson-done",
                    className: "btn btn-primary btn-sm",
                    onClick: () => v(n),
                    children: m.q ? "Check answer" : "Mark as done",
                  }),
            }),
          ],
        }),
      ],
    });
  }
  return (0, A.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, A.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: e,
        children: [(0, A.jsx)(Qr, {}), " All courses"],
      }),
      (0, A.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, A.jsx)("div", { className: "text-base font-bold", children: r.title }),
          (0, A.jsxs)("div", {
            className: "text-[12px]",
            style: Me,
            children: [
              "by ",
              r.teacherName,
              r.instName ? ` \xB7 ${r.instName}` : " \xB7 independent teacher",
              " \xB7 ",
              r.level,
              " \xB7 ",
              r.students,
              " students",
            ],
          }),
          r.summary && (0, A.jsx)("div", { className: "text-[13px] mt-1.5", children: r.summary }),
          r.skills.length > 0 &&
            (0, A.jsx)("div", {
              className: "flex gap-1 flex-wrap mt-1.5",
              children: r.skills.map((m) =>
                (0, A.jsx)(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded",
                    style: { background: "rgba(77,163,255,.14)" },
                    children: m,
                  },
                  m,
                ),
              ),
            }),
          (0, A.jsx)("div", {
            className: "mt-2",
            children: u
              ? (0, A.jsx)("span", {
                  className: "text-[12px]",
                  style: Me,
                  children: "You teach this course. Manage students in the Teach tab.",
                })
              : o
                ? (0, A.jsxs)("div", {
                    children: [
                      (0, A.jsx)("div", {
                        className: "h-1.5 rounded-full bg-white/10 overflow-hidden",
                        children: (0, A.jsx)("div", {
                          className: "h-full",
                          style: { width: `${g}%`, background: "var(--accent)" },
                        }),
                      }),
                      (0, A.jsxs)("div", {
                        className: "text-[11px] mt-1",
                        style: Me,
                        children: [
                          g,
                          "% complete",
                          o.completedAt && !h
                            ? " \xB7 waiting for your teacher to issue the certificate"
                            : "",
                        ],
                      }),
                    ],
                  })
                : (0, A.jsxs)("button", {
                    id: "enroll",
                    className: "btn btn-primary btn-sm",
                    onClick: p,
                    children: [(0, A.jsx)(cd, {}), " Enrol ", r.fee ? `\xB7 ${q(r.fee)}` : "\xB7 free"],
                  }),
          }),
        ],
      }),
      h && (0, A.jsx)(Mu, { cert: h }),
      (0, A.jsx)("div", {
        className: "space-y-1",
        children: r.lessons.map((m, f) => {
          let y = o?.done.includes(f);
          return (0, A.jsxs)(
            "button",
            {
              "data-lesson": f,
              className: "w-full text-left rounded-lg px-2.5 py-2 flex items-center gap-2 card-hover",
              style: { border: "1px solid var(--line)", opacity: o || u ? 1 : 0.6 },
              disabled: !o && !u,
              onClick: () => i(f),
              children: [
                (0, A.jsx)("span", {
                  className: "w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold shrink-0",
                  style: {
                    background: y ? "#45e0ae" : "rgba(255,255,255,.08)",
                    color: y ? "#06281e" : void 0,
                  },
                  children: y ? (0, A.jsx)(_e, {}) : f + 1,
                }),
                (0, A.jsx)("span", { className: "flex-1 text-[13px] font-semibold", children: m.title }),
                m.q && (0, A.jsx)("span", { className: "text-[10px]", style: Me, children: "quiz" }),
              ],
            },
            f,
          );
        }),
      }),
    ],
  });
}
function RR({ open: t }) {
  let e = Y(),
    a = e.eduMine;
  return a
    ? (0, A.jsxs)("div", {
        className: "space-y-3",
        children: [
          (0, A.jsxs)("div", {
            children: [
              (0, A.jsxs)("div", {
                className: "text-[11px] font-bold tracking-wide mb-1",
                style: Me,
                children: ["MY CERTIFICATES (", a.certs.length, ")"],
              }),
              a.certs.length === 0
                ? (0, A.jsx)("div", {
                    className: "text-[12px]",
                    style: Me,
                    children:
                      "Finish a course and your teacher issues the certificate. Fyrus Academy courses issue it automatically.",
                  })
                : (0, A.jsx)("div", {
                    className: "space-y-2",
                    children: a.certs.map((r) => (0, A.jsx)(Mu, { cert: r }, r.code)),
                  }),
            ],
          }),
          (0, A.jsxs)("div", {
            children: [
              (0, A.jsxs)("div", {
                className: "text-[11px] font-bold tracking-wide mb-1",
                style: Me,
                children: ["MY COURSES (", a.enr.length, ")"],
              }),
              a.enr.length === 0
                ? (0, A.jsx)("div", {
                    className: "text-[12px]",
                    style: Me,
                    children: "No courses yet. Explore and enrol \u2014 Fyrus Academy courses are free.",
                  })
                : (0, A.jsx)("div", {
                    className: "space-y-1.5",
                    children: a.enr.map((r) => {
                      let o = e.edu?.courses.find((s) => s.id === r.course),
                        n = o?.lessons.length || 1,
                        i = Math.round((r.done.length / n) * 100);
                      return (0, A.jsxs)(
                        "button",
                        {
                          className: "w-full text-left rounded-lg p-2.5 card-hover",
                          style: { border: "1px solid var(--line)" },
                          onClick: () => t(r.course),
                          children: [
                            (0, A.jsxs)("div", {
                              className: "flex text-sm font-bold",
                              children: [
                                (0, A.jsx)("span", {
                                  className: "flex-1 truncate",
                                  children: o?.title || r.course,
                                }),
                                (0, A.jsx)("span", {
                                  className: "text-[11px]",
                                  style: { color: r.cert ? "#45e0ae" : "var(--ink-dim)" },
                                  children: r.cert ? "Certified" : r.completedAt ? "Finished" : `${i}%`,
                                }),
                              ],
                            }),
                            (0, A.jsx)("div", {
                              className: "h-1 rounded-full bg-white/10 overflow-hidden mt-1.5",
                              children: (0, A.jsx)("div", {
                                className: "h-full",
                                style: { width: `${i}%`, background: "var(--accent)" },
                              }),
                            }),
                          ],
                        },
                        r.course,
                      );
                    }),
                  }),
            ],
          }),
        ],
      })
    : (0, A.jsx)("div", { className: "text-sm", style: Me, children: "Loading\u2026" });
}
var cy = () => ({ title: "", body: "", video: "", q: "", opts: ["", ""], ans: 0 });
function BR() {
  let e = Y().eduMine,
    [a, r] = (0, ra.useState)(""),
    [o, n] = (0, ra.useState)(""),
    [i, s] = (0, ra.useState)(null);
  return e
    ? e.teacher
      ? i
        ? (0, A.jsx)(AR, { init: i, insts: e.inst, done: () => s(null) })
        : (0, A.jsxs)("div", {
            className: "space-y-3",
            children: [
              (0, A.jsxs)("div", {
                className: "card p-3 flex items-center gap-2",
                children: [
                  (0, A.jsxs)("div", {
                    className: "flex-1",
                    children: [
                      (0, A.jsx)("div", { className: "text-sm font-bold", children: e.teacher.name }),
                      (0, A.jsxs)("div", {
                        className: "text-[11px]",
                        style: Me,
                        children: [
                          e.teacher.subject,
                          e.inst.length
                            ? ` \xB7 teaches at ${e.inst.map((l) => l.name).join(", ")}`
                            : " \xB7 independent",
                        ],
                      }),
                    ],
                  }),
                  (0, A.jsxs)("button", {
                    id: "new-course",
                    className: "btn btn-primary btn-sm",
                    onClick: () =>
                      s({
                        title: "",
                        summary: "",
                        skills: "",
                        level: "Beginner",
                        fee: 0,
                        inst: e.inst[0]?.id || "",
                        lessons: [cy()],
                      }),
                    children: [(0, A.jsx)(Na, {}), " New course"],
                  }),
                ],
              }),
              (0, A.jsxs)("div", {
                children: [
                  (0, A.jsxs)("div", {
                    className: "text-[11px] font-bold tracking-wide mb-1",
                    style: Me,
                    children: ["MY COURSES (", e.teaching.length, ")"],
                  }),
                  e.teaching.map((l) =>
                    (0, A.jsxs)(
                      "div",
                      {
                        className: "rounded-lg p-2.5 mb-1.5 flex items-center gap-2",
                        style: { border: "1px solid var(--line)" },
                        children: [
                          (0, A.jsxs)("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              (0, A.jsx)("div", {
                                className: "text-sm font-bold truncate",
                                children: l.title,
                              }),
                              (0, A.jsxs)("div", {
                                className: "text-[11px]",
                                style: Me,
                                children: [
                                  l.lessons.length,
                                  " lessons \xB7 ",
                                  l.students,
                                  " students \xB7 ",
                                  l.fee ? q(l.fee) : "free",
                                  l.instName ? ` \xB7 ${l.instName}` : "",
                                ],
                              }),
                            ],
                          }),
                          (0, A.jsx)("button", {
                            className: "btn btn-ghost btn-sm",
                            onClick: () =>
                              s({
                                ...l,
                                skills: l.skills.join(", "),
                                inst: l.inst || "",
                                lessons: l.lessons.map((c) => ({
                                  ...cy(),
                                  ...c,
                                  opts: c.opts || ["", ""],
                                  video: c.video || "",
                                  q: c.q || "",
                                })),
                              }),
                            children: "Edit",
                          }),
                        ],
                      },
                      l.id,
                    ),
                  ),
                  e.teaching.length === 0 &&
                    (0, A.jsx)("div", { className: "text-[12px]", style: Me, children: "No courses yet." }),
                ],
              }),
              (0, A.jsxs)("div", {
                children: [
                  (0, A.jsxs)("div", {
                    className: "text-[11px] font-bold tracking-wide mb-1",
                    style: Me,
                    children: [
                      (0, A.jsx)($e, { className: "inline" }),
                      " MY STUDENTS (",
                      e.students.length,
                      ")",
                    ],
                  }),
                  e.students.length === 0
                    ? (0, A.jsx)("div", {
                        className: "text-[12px]",
                        style: Me,
                        children: "Students appear here when they enrol.",
                      })
                    : (0, A.jsx)("div", {
                        className: "space-y-1",
                        children: e.students.map((l) => {
                          let c = e.teaching.find((d) => d.id === l.course);
                          return (0, A.jsxs)(
                            "div",
                            {
                              className: "rounded-lg px-2.5 py-2 flex items-center gap-2 text-[13px]",
                              style: { border: "1px solid var(--line)" },
                              children: [
                                (0, A.jsxs)("div", {
                                  className: "flex-1 min-w-0",
                                  children: [
                                    (0, A.jsx)("b", { children: l.userName }),
                                    (0, A.jsxs)("div", {
                                      className: "text-[11px] truncate",
                                      style: Me,
                                      children: [c?.title, " \xB7 ", l.done.length, "/", l.total, " lessons"],
                                    }),
                                  ],
                                }),
                                l.cert
                                  ? (0, A.jsx)("span", {
                                      className: "text-[11px] font-mono",
                                      style: { color: "#45e0ae" },
                                      children: l.cert,
                                    })
                                  : l.completedAt
                                    ? (0, A.jsxs)("button", {
                                        className: "btn btn-primary btn-sm",
                                        "data-issue": l.user,
                                        onClick: () =>
                                          O.send({ t: "edu_issue", course: l.course, student: l.user }),
                                        children: [(0, A.jsx)(gE, {}), " Issue certificate"],
                                      })
                                    : (0, A.jsx)("span", {
                                        className: "text-[11px]",
                                        style: Me,
                                        children: "studying",
                                      }),
                              ],
                            },
                            l.course + l.user,
                          );
                        }),
                      }),
                ],
              }),
            ],
          })
      : (0, A.jsxs)("div", {
          className: "card p-3 space-y-2",
          id: "teacher-register",
          children: [
            (0, A.jsx)("div", { className: "font-bold text-sm", children: "Register as a teacher" }),
            (0, A.jsx)("div", {
              className: "text-[12px]",
              style: Me,
              children:
                "Teach on your own or for an institution. You set the fee (or keep it free), publish lessons with quick checks, and issue certificates to students who finish. You receive 90% of every fee.",
            }),
            (0, A.jsx)("input", {
              className: "field py-1.5 text-sm",
              value: a,
              onChange: (l) => r(l.target.value),
              placeholder: "What do you teach? (e.g. Python for AI)",
              maxLength: 60,
            }),
            (0, A.jsx)("textarea", {
              className: "field py-1.5 text-sm",
              rows: 3,
              value: o,
              onChange: (l) => n(l.target.value),
              placeholder: "About you: experience, degrees, links",
              maxLength: 400,
            }),
            (0, A.jsxs)("button", {
              className: "btn btn-primary btn-sm",
              onClick: () => O.send({ t: "edu_teacher", subject: a, bio: o }),
              children: [(0, A.jsx)(Xl, {}), " Register"],
            }),
          ],
        })
    : (0, A.jsx)("div", { className: "text-sm", style: Me, children: "Loading\u2026" });
}
function AR({ init: t, insts: e, done: a }) {
  let [r, o] = (0, ra.useState)(t),
    n = (l) => o((c) => ({ ...c, ...l })),
    i = (l, c) => n({ lessons: r.lessons.map((d, h) => (h === l ? { ...d, ...c } : d)) }),
    s = () => {
      let l = r.lessons
        .filter((c) => c.title.trim() && c.body.trim())
        .map((c) => {
          let d = c.opts.map((h) => h.trim()).filter(Boolean);
          return {
            title: c.title,
            body: c.body,
            video: c.video || void 0,
            ...(c.q.trim() && d.length >= 2 ? { q: c.q, opts: d, ans: Math.min(c.ans, d.length - 1) } : {}),
          };
        });
      if (r.title.trim().length < 4 || !l.length)
        return F("Add a title and at least one lesson with text.", "warn");
      (O.send({
        t: "edu_course",
        id: r.id,
        title: r.title,
        summary: r.summary,
        skills: r.skills,
        level: r.level,
        fee: +r.fee || 0,
        inst: r.inst || void 0,
        lessons: l,
      }),
        a());
    };
  return (0, A.jsxs)("div", {
    className: "space-y-2",
    id: "course-editor",
    children: [
      (0, A.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: a,
        children: [(0, A.jsx)(Qr, {}), " Cancel"],
      }),
      (0, A.jsx)("input", {
        className: "field py-1.5 text-sm",
        value: r.title,
        onChange: (l) => n({ title: l.target.value }),
        placeholder: "Course title",
        maxLength: 80,
        "aria-label": "Course title",
      }),
      (0, A.jsx)("textarea", {
        className: "field py-1.5 text-sm",
        rows: 2,
        value: r.summary,
        onChange: (l) => n({ summary: l.target.value }),
        placeholder: "What students will be able to do",
        maxLength: 300,
      }),
      (0, A.jsx)("input", {
        className: "field py-1.5 text-sm",
        value: r.skills,
        onChange: (l) => n({ skills: l.target.value }),
        placeholder: "Skills, comma separated (shown on the certificate)",
      }),
      (0, A.jsxs)("div", {
        className: "grid grid-cols-3 gap-1.5",
        children: [
          (0, A.jsx)("select", {
            className: "field py-1.5 text-sm",
            value: r.level,
            onChange: (l) => n({ level: l.target.value }),
            "aria-label": "Level",
            children: ["Beginner", "Intermediate", "Advanced"].map((l) =>
              (0, A.jsx)("option", { children: l }, l),
            ),
          }),
          (0, A.jsx)("input", {
            className: "field py-1.5 text-sm",
            type: "number",
            min: 0,
            value: r.fee,
            onChange: (l) => n({ fee: l.target.value }),
            "aria-label": "Fee in FYC",
            placeholder: "Fee (0 = free)",
          }),
          (0, A.jsxs)("select", {
            className: "field py-1.5 text-sm",
            value: r.inst,
            onChange: (l) => n({ inst: l.target.value }),
            "aria-label": "Institution",
            children: [
              (0, A.jsx)("option", { value: "", children: "Independent" }),
              e.map((l) => (0, A.jsx)("option", { value: l.id, children: l.name }, l.id)),
            ],
          }),
        ],
      }),
      r.lessons.map((l, c) =>
        (0, A.jsxs)(
          "div",
          {
            className: "rounded-lg p-2.5 space-y-1.5",
            style: { border: "1px solid var(--line)" },
            children: [
              (0, A.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [
                  (0, A.jsxs)("b", { className: "text-[12px] flex-1", children: ["Lesson ", c + 1] }),
                  r.lessons.length > 1 &&
                    (0, A.jsx)("button", {
                      className: "text-[12px]",
                      style: Me,
                      onClick: () => n({ lessons: r.lessons.filter((d, h) => h !== c) }),
                      "aria-label": "Remove lesson",
                      children: (0, A.jsx)(_l, {}),
                    }),
                ],
              }),
              (0, A.jsx)("input", {
                className: "field py-1.5 text-sm",
                value: l.title,
                onChange: (d) => i(c, { title: d.target.value }),
                placeholder: "Lesson title",
                maxLength: 80,
                "aria-label": `Lesson ${c + 1} title`,
              }),
              (0, A.jsx)("textarea", {
                className: "field py-1.5 text-sm",
                rows: 4,
                value: l.body,
                onChange: (d) => i(c, { body: d.target.value }),
                placeholder: "Lesson text",
                maxLength: 4e3,
                "aria-label": `Lesson ${c + 1} text`,
              }),
              (0, A.jsx)("input", {
                className: "field py-1.5 text-sm",
                value: l.video,
                onChange: (d) => i(c, { video: d.target.value }),
                placeholder: "Optional video link (YouTube or Vimeo)",
              }),
              (0, A.jsx)("input", {
                className: "field py-1.5 text-sm",
                value: l.q,
                onChange: (d) => i(c, { q: d.target.value }),
                placeholder: "Optional quick-check question",
                maxLength: 200,
              }),
              l.q &&
                (0, A.jsxs)("div", {
                  className: "space-y-1",
                  children: [
                    l.opts.map((d, h) =>
                      (0, A.jsxs)(
                        "div",
                        {
                          className: "flex gap-1 items-center",
                          children: [
                            (0, A.jsx)("input", {
                              type: "radio",
                              checked: l.ans === h,
                              onChange: () => i(c, { ans: h }),
                              "aria-label": `Correct answer ${h + 1}`,
                            }),
                            (0, A.jsx)("input", {
                              className: "field py-1 text-sm",
                              value: d,
                              onChange: (u) =>
                                i(c, { opts: l.opts.map((p, v) => (v === h ? u.target.value : p)) }),
                              placeholder: `Answer ${h + 1}`,
                            }),
                          ],
                        },
                        h,
                      ),
                    ),
                    l.opts.length < 5 &&
                      (0, A.jsx)("button", {
                        className: "text-[12px] underline",
                        onClick: () => i(c, { opts: [...l.opts, ""] }),
                        children: "Add an answer",
                      }),
                    (0, A.jsx)("div", {
                      className: "text-[11px]",
                      style: Me,
                      children: "Tick the correct answer. Students must get it right to finish the lesson.",
                    }),
                  ],
                }),
            ],
          },
          c,
        ),
      ),
      (0, A.jsxs)("div", {
        className: "flex gap-1.5",
        children: [
          (0, A.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => n({ lessons: [...r.lessons, cy()] }),
            children: [(0, A.jsx)(Na, {}), " Add lesson"],
          }),
          (0, A.jsxs)("button", {
            id: "publish-course",
            className: "btn btn-primary btn-sm",
            onClick: s,
            children: [(0, A.jsx)(_e, {}), " ", r.id ? "Save course" : "Publish course"],
          }),
        ],
      }),
    ],
  });
}
function zR() {
  let t = Y(),
    [e, a] = (0, ra.useState)("school"),
    [r, o] = (0, ra.useState)(""),
    [n, i] = (0, ra.useState)(""),
    [s, l] = (0, ra.useState)("#2f6fe0"),
    [c, d] = (0, ra.useState)({}),
    h = (t.eduMine?.inst || []).filter((u) => u.owner === t.net.id);
  return (0, A.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, A.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-1.5",
        children: Kg.map((u) =>
          (0, A.jsxs)(
            "button",
            {
              "data-portal": u.id,
              className: "text-left rounded-lg p-2.5",
              style: {
                border: `1px solid ${e === u.id ? "var(--accent)" : "var(--line)"}`,
                background: e === u.id ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
              },
              onClick: () => a(u.id),
              children: [
                (0, A.jsxs)("div", {
                  className: "text-sm font-bold flex items-center gap-1.5",
                  children: [(0, A.jsx)(u.icon, {}), " ", u.one, " portal"],
                }),
                (0, A.jsx)("div", { className: "text-[11px]", style: Me, children: u.desc }),
              ],
            },
            u.id,
          ),
        ),
      }),
      (0, A.jsxs)("div", {
        className: "card p-3 space-y-2",
        children: [
          (0, A.jsxs)("div", {
            className: "text-sm font-bold",
            children: ["Register a ", Kg.find((u) => u.id === e).one.toLowerCase()],
          }),
          (0, A.jsx)("input", {
            className: "field py-1.5 text-sm",
            value: r,
            onChange: (u) => o(u.target.value),
            placeholder: "Official name",
            maxLength: 60,
            "aria-label": "Institution name",
          }),
          (0, A.jsx)("input", {
            className: "field py-1.5 text-sm",
            value: n,
            onChange: (u) => i(u.target.value),
            placeholder: "One line about it (city, programs, since\u2026)",
            maxLength: 120,
          }),
          (0, A.jsxs)("label", {
            className: "flex items-center gap-2 text-[12px]",
            children: [
              "Colour ",
              (0, A.jsx)("input", { type: "color", value: s, onChange: (u) => l(u.target.value) }),
            ],
          }),
          (0, A.jsx)("div", {
            className: "text-[11px]",
            style: Me,
            children:
              "New institutions show as Registered. The Ministry marks real schools and universities as Verified after a review. You become its first teacher and can add more teachers by their +2040 number.",
          }),
          (0, A.jsxs)("button", {
            id: "register-inst",
            className: "btn btn-primary btn-sm",
            onClick: () => O.send({ t: "edu_inst", type: e, name: r, tagline: n, color: s }),
            children: [(0, A.jsx)(t0, {}), " Register"],
          }),
        ],
      }),
      h.length > 0 &&
        (0, A.jsxs)("div", {
          children: [
            (0, A.jsx)("div", {
              className: "text-[11px] font-bold tracking-wide mb-1",
              style: Me,
              children: "MY INSTITUTIONS",
            }),
            h.map((u) =>
              (0, A.jsxs)(
                "div",
                {
                  className: "rounded-lg p-2.5 mb-1.5",
                  style: { border: "1px solid var(--line)" },
                  children: [
                    (0, A.jsxs)("div", {
                      className: "text-sm font-bold",
                      children: [
                        u.name,
                        " ",
                        (0, A.jsxs)("span", {
                          className: "text-[11px] font-normal",
                          style: Me,
                          children: [
                            "\xB7 ",
                            u.type,
                            " \xB7 ",
                            u.staff.length,
                            " teacher",
                            u.staff.length === 1 ? "" : "s",
                            " \xB7 ",
                            u.verified ? "Verified" : "Registered",
                          ],
                        }),
                      ],
                    }),
                    (0, A.jsxs)("div", {
                      className: "flex gap-1.5 mt-1.5",
                      children: [
                        (0, A.jsx)("input", {
                          className: "field py-1 text-sm",
                          value: c[u.id] || "",
                          onChange: (p) => d({ ...c, [u.id]: p.target.value }),
                          placeholder: "Add a teacher by +2040 number",
                        }),
                        (0, A.jsxs)("button", {
                          className: "btn btn-ghost btn-sm",
                          onClick: () => O.send({ t: "edu_staff", inst: u.id, number: c[u.id] || "" }),
                          children: [(0, A.jsx)(Na, {}), " Add"],
                        }),
                      ],
                    }),
                  ],
                },
                u.id,
              ),
            ),
          ],
        }),
    ],
  });
}
function jR() {
  let [t, e] = (0, ra.useState)(""),
    [a, r] = (0, ra.useState)(void 0);
  return (
    (0, ra.useEffect)(() => O.on("edu_cert", (o) => r(o.cert)), []),
    (0, A.jsxs)("div", {
      className: "space-y-2",
      children: [
        (0, A.jsx)("div", {
          className: "text-[12px]",
          style: Me,
          children: "Employers and anyone else can check a certificate here or at fyrus.io/verify/CODE.",
        }),
        (0, A.jsxs)("div", {
          className: "flex gap-1.5",
          children: [
            (0, A.jsx)("input", {
              className: "field py-1.5 text-sm font-mono",
              value: t,
              onChange: (o) => e(o.target.value.toUpperCase()),
              placeholder: "FC-XXXX-XXXX-XXXX",
              "aria-label": "Certificate code",
            }),
            (0, A.jsxs)("button", {
              id: "verify-btn",
              className: "btn btn-primary btn-sm",
              onClick: () => {
                (r(void 0), O.send({ t: "edu_verify", code: t.trim() }));
              },
              children: [(0, A.jsx)(yr, {}), " Check"],
            }),
          ],
        }),
        a === null &&
          (0, A.jsx)("div", {
            className: "text-[13px]",
            style: { color: "var(--rose)" },
            children: "No valid certificate has this code.",
          }),
        a &&
          (0, A.jsxs)(A.Fragment, {
            children: [
              (0, A.jsxs)("div", {
                className: "text-[13px] font-bold",
                style: { color: "#45e0ae" },
                children: [(0, A.jsx)(yr, { className: "inline" }), " Valid certificate"],
              }),
              (0, A.jsx)(Mu, { cert: a }),
            ],
          }),
      ],
    })
  );
}
function WR(t, e) {
  ((e.width = 1200), (e.height = 850));
  let o = e.getContext("2d");
  ((o.fillStyle = "#fbf8f1"),
    o.fillRect(0, 0, 1200, 850),
    (o.strokeStyle = "#b8862b"),
    (o.lineWidth = 10),
    o.strokeRect(30, 30, 1140, 790),
    (o.lineWidth = 2),
    o.strokeRect(50, 50, 1100, 750),
    (o.fillStyle = "#2f6fe0"),
    o.beginPath(),
    o.arc(1200 / 2, 135, 34, 0, Math.PI * 2),
    o.fill(),
    (o.strokeStyle = "#ff9a3c"),
    (o.lineWidth = 6),
    o.beginPath(),
    o.ellipse(1200 / 2, 135, 56, 22, -0.35, 0, Math.PI * 2),
    o.stroke(),
    (o.textAlign = "center"),
    (o.fillStyle = "#8a6a2b"),
    (o.font = '700 20px "JetBrains Mono", monospace'),
    o.fillText("REPUBLIC OF FYRUS \xB7 CERTIFICATE OF COMPLETION", 1200 / 2, 215),
    (o.fillStyle = "#1b2433"),
    (o.font = '400 26px "Plus Jakarta Sans", sans-serif'),
    o.fillText("This certifies that", 1200 / 2, 285),
    (o.font = "800 60px Sora, serif"),
    o.fillText(t.studentName, 1200 / 2, 360),
    (o.font = '400 26px "Plus Jakarta Sans", sans-serif'),
    o.fillText("has completed", 1200 / 2, 415));
  let n = 44;
  for (o.font = `700 ${n}px Sora, sans-serif`; o.measureText(t.courseTitle).width > 1e3 && n > 22; )
    ((n -= 2), (o.font = `700 ${n}px Sora, sans-serif`));
  ((o.fillStyle = "#2f6fe0"),
    o.fillText(t.courseTitle, 1200 / 2, 480),
    (o.fillStyle = "#4a5568"),
    (o.font = '500 22px "Plus Jakarta Sans", sans-serif'),
    o.fillText(
      `${t.level} \xB7 ${t.lessons} lessons${t.skills?.length ? " \xB7 Skills: " + t.skills.join(", ") : ""}`.slice(
        0,
        95,
      ),
      1200 / 2,
      528,
    ));
  let i = new Date(t.issuedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  ((o.textAlign = "left"),
    (o.strokeStyle = "#1b2433"),
    (o.lineWidth = 1.5),
    o.beginPath(),
    o.moveTo(140, 655),
    o.lineTo(520, 655),
    o.stroke(),
    o.beginPath(),
    o.moveTo(680, 655),
    o.lineTo(1060, 655),
    o.stroke(),
    (o.fillStyle = "#1b2433"),
    (o.font = 'italic 600 34px "Playfair Display", serif'),
    o.fillText(t.teacherName, 150, 640),
    (o.font = '600 18px "Plus Jakarta Sans", sans-serif'),
    (o.fillStyle = "#4a5568"),
    o.fillText("Issued by the teacher", 140, 685),
    o.fillText(
      t.instName
        ? `${t.instName}${t.instVerified ? " \xB7 verified" : " \xB7 registered"}`
        : "Independent teacher",
      680,
      685,
    ),
    (o.fillStyle = "#1b2433"),
    (o.font = '700 26px "Plus Jakarta Sans", sans-serif'),
    o.fillText(i, 690, 640),
    (o.textAlign = "center"),
    (o.fillStyle = "#8a6a2b"),
    (o.font = '600 18px "JetBrains Mono", monospace'),
    o.fillText(`Verify: fyrus.io/verify/${t.code}`, 1200 / 2, 760),
    (o.fillStyle = "#9aa3ad"),
    (o.font = '500 14px "Plus Jakarta Sans", sans-serif'),
    o.fillText("A Fyrus course-completion certificate. Not a government degree.", 1200 / 2, 788));
}
function Mu({ cert: t }) {
  let e = (0, ra.useRef)(null),
    [a, r] = (0, ra.useState)("");
  (0, ra.useEffect)(() => {
    if (!e.current) return;
    WR(t, e.current);
    let s = setTimeout(() => {
      try {
        r(e.current.toDataURL("image/png"));
      } catch {}
    }, 300);
    return () => clearTimeout(s);
  }, [t.code]);
  let o = SR(t.code),
    n = `I earned a certificate in "${t.courseTitle}" from ${t.teacherName}${t.instName ? ` (${t.instName})` : ""} in Fyrus. Verify it:`,
    i = async () => {
      let s = navigator;
      try {
        s.share
          ? await s.share({ text: n, url: o })
          : (await navigator.clipboard.writeText(`${n} ${o}`),
            F("Copied. Paste it on your profile or CV.", "info"));
      } catch {}
    };
  return (0, A.jsxs)("div", {
    className: "rounded-lg overflow-hidden",
    style: { border: "1px solid var(--line)" },
    "data-cert": t.code,
    children: [
      (0, A.jsx)("canvas", {
        ref: e,
        className: "w-full block",
        style: { aspectRatio: "1200 / 850" },
        "aria-label": `Certificate ${t.code}`,
      }),
      (0, A.jsxs)("div", {
        className: "flex flex-wrap gap-1.5 p-2",
        children: [
          (0, A.jsx)("span", {
            className: "text-[11px] font-mono self-center flex-1",
            style: Me,
            children: t.code,
          }),
          (0, A.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: i,
            children: [(0, A.jsx)(ni, {}), " Share"],
          }),
          (0, A.jsx)("a", {
            className: "btn btn-ghost btn-sm",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(o)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            children: "LinkedIn",
          }),
          a &&
            (0, A.jsx)("a", {
              className: "btn btn-ghost btn-sm",
              href: a,
              download: `fyrus-certificate-${t.code}.png`,
              children: (0, A.jsx)(c0, {}),
            }),
          (0, A.jsxs)("a", {
            className: "btn btn-ghost btn-sm",
            href: o,
            target: "_blank",
            rel: "noopener noreferrer",
            children: [(0, A.jsx)(fg, {}), " Verify"],
          }),
        ],
      }),
    ],
  });
}
var Gt = P(ct(), 1),
  IR = ["#a8d8ff", "#4da3ff", "#2f6fe0", "#ff9a3c", "#ffc27a", "#45e0ae", "#ff7a59", "#8f9dff"];
function uy() {
  let t = Y(),
    e = t.session.userId,
    a = t.focus?.kind === "user" ? t.focus.id : e,
    r = be(a),
    o = a === e,
    [n, i] = (0, hy.useState)(!1),
    [s, l] = (0, hy.useState)({ name: r.name, title: r.title, bio: r.bio, color: r.color }),
    c = t.agents.filter((y) => y.ownerId === a),
    d = t.gigs.filter((y) => y.ownerId === a),
    h = t.videos.filter((y) => y.ownerId === a),
    u = t.articles.filter((y) => y.ownerId === a),
    p = t.orders.filter((y) => y.buyerId === a).reduce((y, x) => y + x.amount, 0),
    v = t.txns
      .filter((y) => y.userId === a && y.amount > 0 && !/Welcome|Signup|top-up/i.test(y.label))
      .reduce((y, x) => y + x.amount, 0),
    g = t.affLinks.filter((y) => y.userId === a).reduce((y, x) => y + x.earned, 0),
    m = () => {
      (C((y) => ({ users: y.users.map((x) => (x.id === e ? { ...x, ...s } : x)) })),
        i(!1),
        F("Profile updated."));
    },
    f = Tr(t.game.xp);
  return (0, Gt.jsxs)("div", {
    className: "space-y-4",
    children: [
      !o &&
        (0, Gt.jsx)("button", {
          className: "chip",
          onClick: () => C({ focus: null }),
          children: "\u2190 My profile",
        }),
      o &&
        (t.eduMine?.certs.length || 0) > 0 &&
        (0, Gt.jsxs)("div", {
          className: "card p-3",
          children: [
            (0, Gt.jsx)("div", {
              className: "text-[11px] font-bold tracking-wide mb-2",
              style: { color: "var(--ink-dim)" },
              children: "CERTIFICATES \xB7 shown to employers",
            }),
            (0, Gt.jsx)("div", {
              className: "grid sm:grid-cols-2 gap-2",
              children: t.eduMine.certs.map((y) => (0, Gt.jsx)(Mu, { cert: y }, y.code)),
            }),
          ],
        }),
      (0, Gt.jsxs)("div", {
        className: "card holo-edge p-5",
        children: [
          (0, Gt.jsxs)("div", {
            className: "flex gap-4 items-center",
            children: [
              (0, Gt.jsx)(Dr, { user: r, size: 72 }),
              (0, Gt.jsxs)("div", {
                className: "min-w-0 flex-1",
                children: [
                  (0, Gt.jsxs)("div", {
                    className: "font-display text-xl font-bold flex items-center gap-1.5",
                    children: [r.name, r.verified && (0, Gt.jsx)(Jl, { style: { color: "var(--blue-hi)" } })],
                  }),
                  (0, Gt.jsxs)("div", {
                    className: "text-sm",
                    style: { color: "var(--ink-dim)" },
                    children: ["@", r.handle, " \xB7 ", r.title],
                  }),
                  (0, Gt.jsxs)("div", {
                    className: "text-xs mt-1 tabular flex gap-3",
                    style: { color: "var(--ink-dim)" },
                    children: [
                      (0, Gt.jsxs)("span", { children: [r.followers.toLocaleString("en-US"), " followers"] }),
                      (0, Gt.jsxs)("span", { children: ["\u2605 ", r.rating] }),
                      o &&
                        (0, Gt.jsxs)(Gt.Fragment, {
                          children: [
                            (0, Gt.jsxs)("span", {
                              className: "flex items-center gap-1",
                              style: { color: "var(--ember-hi)" },
                              children: [(0, Gt.jsx)($l, {}), " Level ", f],
                            }),
                            (0, Gt.jsxs)("span", {
                              className: "flex items-center gap-1",
                              style: { color: "var(--ember)" },
                              children: [(0, Gt.jsx)(l0, {}), " ", t.game.streak, "-day streak"],
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          (0, Gt.jsx)("p", { className: "text-sm mt-3", children: r.bio }),
          (0, Gt.jsx)("div", {
            className: "flex gap-1.5 flex-wrap mt-3",
            children: r.skills.map((y) => (0, Gt.jsx)("span", { className: "chip", children: y }, y)),
          }),
          (0, Gt.jsxs)("div", {
            className: "flex gap-2 mt-4 flex-wrap",
            children: [
              (0, Gt.jsxs)("button", {
                className: "btn btn-primary btn-sm",
                onClick: () => {
                  (r.procedural && Is(r), yo(a), ca());
                },
                children: [(0, Gt.jsx)(Ma, {}), " ", o ? "Go to my home" : "Visit their home"],
              }),
              o &&
                (0, Gt.jsxs)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => i((y) => !y),
                  children: [(0, Gt.jsx)(q8, {}), " Edit profile"],
                }),
              o &&
                (0, Gt.jsxs)("button", {
                  className: "btn btn-ghost btn-sm ml-auto",
                  onClick: zp,
                  children: [(0, Gt.jsx)(J8, {}), " Log out"],
                }),
            ],
          }),
        ],
      }),
      !o && (0, Gt.jsx)(as, { userId: a }),
      n &&
        (0, Gt.jsxs)("form", {
          className: "card p-4 space-y-3 pop-in",
          onSubmit: (y) => {
            (y.preventDefault(), m());
          },
          children: [
            (0, Gt.jsxs)("div", {
              children: [
                (0, Gt.jsx)("label", { className: "label", htmlFor: "pf-name", children: "Name" }),
                (0, Gt.jsx)("input", {
                  id: "pf-name",
                  className: "field",
                  value: s.name,
                  onChange: (y) => l({ ...s, name: y.target.value }),
                }),
              ],
            }),
            (0, Gt.jsxs)("div", {
              children: [
                (0, Gt.jsx)("label", { className: "label", htmlFor: "pf-title", children: "Title" }),
                (0, Gt.jsx)("input", {
                  id: "pf-title",
                  className: "field",
                  value: s.title,
                  onChange: (y) => l({ ...s, title: y.target.value }),
                }),
              ],
            }),
            (0, Gt.jsxs)("div", {
              children: [
                (0, Gt.jsx)("label", { className: "label", htmlFor: "pf-bio", children: "Bio" }),
                (0, Gt.jsx)("textarea", {
                  id: "pf-bio",
                  className: "field",
                  value: s.bio,
                  onChange: (y) => l({ ...s, bio: y.target.value }),
                }),
              ],
            }),
            (0, Gt.jsxs)("div", {
              children: [
                (0, Gt.jsx)("div", { className: "label", children: "Avatar color" }),
                (0, Gt.jsx)("div", {
                  className: "flex gap-2 flex-wrap",
                  children: IR.map((y) =>
                    (0, Gt.jsx)(
                      "button",
                      {
                        type: "button",
                        onClick: () => l({ ...s, color: y }),
                        className: "w-8 h-8 rounded-full",
                        "aria-label": `Color ${y}`,
                        style: {
                          background: y,
                          outline: s.color === y ? "2px solid #fff" : "none",
                          outlineOffset: 2,
                        },
                      },
                      y,
                    ),
                  ),
                }),
              ],
            }),
            (0, Gt.jsx)("div", {
              className: "flex justify-end",
              children: (0, Gt.jsx)("button", { className: "btn btn-primary btn-sm", children: "Save" }),
            }),
          ],
        }),
      (0, Gt.jsxs)("div", {
        children: [
          (0, Gt.jsx)(Te, { kicker: "One profile", title: "All three roles in one place" }),
          (0, Gt.jsxs)("div", {
            className: "grid grid-cols-3 gap-2",
            children: [
              (0, Gt.jsx)(Ra, { label: "Client \xB7 spent", value: q(p) }),
              (0, Gt.jsx)(Ra, {
                label: "Creator \xB7 earned",
                value: q(Math.round(v * 100) / 100),
                tone: "var(--sky)",
              }),
              (0, Gt.jsx)(Ra, {
                label: "Affiliate",
                value: q(Math.round(g * 100) / 100),
                tone: "var(--ember-hi)",
              }),
            ],
          }),
        ],
      }),
      (0, Gt.jsxs)("div", {
        className: "grid grid-cols-4 gap-2",
        children: [
          (0, Gt.jsx)(Ra, { label: "Agents", value: c.length }),
          (0, Gt.jsx)(Ra, { label: "Gigs", value: d.length }),
          (0, Gt.jsx)(Ra, { label: "Videos", value: h.length }),
          (0, Gt.jsx)(Ra, { label: "Articles", value: u.length }),
        ],
      }),
      o &&
        (0, Gt.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, Gt.jsx)("div", { className: "label", children: "Following" }),
            (0, Gt.jsx)("div", {
              className: "flex gap-2 flex-wrap",
              children: (t.follows[e] || []).map((y) => {
                let x = be(y);
                return (
                  x &&
                  (0, Gt.jsx)(
                    "button",
                    {
                      className: "chip",
                      onClick: () => C({ focus: { kind: "user", id: y } }),
                      children: x.name,
                    },
                    y,
                  )
                );
              }),
            }),
          ],
        }),
    ],
  });
}
var py = P(Zt(), 1);
var Mt = P(ct(), 1),
  q7 = ["#a8d8ff", "#4da3ff", "#2f6fe0", "#7fd1ff", "#ff9a3c", "#ffc27a", "#45e0ae", "#ff7a59", "#8f9dff"],
  GR = { agent: Nr, gig: hr, video: Ps, article: gg },
  VR = {
    agent: "Hologram stand",
    gig: "Gig board, left wall",
    video: "Cinema screen",
    article: "Article wall, right",
  },
  Z7 = {
    tower: "\u25AE",
    villa: "\u25AC",
    dome: "\u25D7",
    pyramid: "\u25B2",
    stack: "\u2261",
    spire: "\u27C1",
  };
