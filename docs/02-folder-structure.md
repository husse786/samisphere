# Folder Structure Planning

**Project:** SamiSphere — Online Course Registration Website
**Brand / website name:** SamiSphere
**Built for:** Samira (the teacher)
**Document:** 02 — Folder Structure Planning
**Status:** Approved
**Last updated:** 2026-07-15

---

## 1. Purpose

Define how the project's files and folders are organized **before** any code is
written. Two requirements shape every decision here:

- **Scalable** — today it is only a SvelteKit frontend talking to Firebase.
  Tomorrow it must be possible to add a backend (e.g. Java) or a mobile app
  **without tearing the structure apart**.
- **Centralized & grouped** — shared things (colors, languages, Firebase config,
  data logic) live in **one place each**, not scattered across many files.

Framework decision: **SvelteKit** (the official full framework, with routing
built in). Plain Svelte has no routing, and we need a separate `/dashboard`
route for the teacher, so SvelteKit is required — and is still simple.

---

## 2. The Full Structure

```
samisphere/                           ← THE WHOLE WORKSPACE (one GitHub repo)
│
├── docs/                             ← planning documents
│   ├── 01-architecture.md
│   ├── 02-folder-structure.md
│   └── ...                           (project plan, README drafts, etc.)
│
├── frontend/                         ← THE SVELTEKIT WEBSITE (all of today's work)
│   │
│   ├── public/                       ← static files served as-is
│   │   └── favicon.png
│   │
│   ├── src/                          ← all the app's source code
│   │   │
│   │   ├── lib/                      ← ★ CENTRALIZED, REUSABLE pieces
│   │   │   │
│   │   │   ├── components/           ← UI building blocks (grouped by area)
│   │   │   │   ├── common/           ← shared everywhere
│   │   │   │   │   ├── Header.svelte           ← wordmark + 4-item nav + switcher
│   │   │   │   │   ├── LanguageSwitcher.svelte
│   │   │   │   │   ├── WrongDoor.svelte        ← "you're on the other dashboard"
│   │   │   │   │   └── Button.svelte
│   │   │   │   ├── student/          ← everything the STUDENT sees
│   │   │   │   │   ├── CourseDropdown.svelte
│   │   │   │   │   ├── RegistrationForm.svelte
│   │   │   │   │   ├── StudentLoginForm.svelte    ← the /my login card
│   │   │   │   │   ├── StudentProfile.svelte      ← /my: identity + card list
│   │   │   │   │   └── StudentCourseCard.svelte   ← one registration's card
│   │   │   │   └── teacher/          ← the dashboard pieces
│   │   │   │       ├── CourseManager.svelte
│   │   │   │       ├── LoginForm.svelte
│   │   │   │       ├── RegistrationList.svelte
│   │   │   │       └── StudentLoginButton.svelte  ← create/reset + password reveal
│   │   │   │
│   │   │   ├── config/               ← ★ ONE place for settings
│   │   │   │   └── firebase.js       ← Firebase connection (the only copy):
│   │   │   │                            db, auth, functions
│   │   │   │
│   │   │   ├── services/             ← ★ ALL talking-to-Firebase logic
│   │   │   │   ├── auth.js           ← sign in/out, isTeacher, createStudentLogin
│   │   │   │   ├── courses.js        ← read/add/hide/delete courses
│   │   │   │   └── registrations.js  ← create/read/delete + paid toggle
│   │   │   │
│   │   │   ├── stores/               ← app-wide state (e.g. current language)
│   │   │   │   └── language.js
│   │   │   │
│   │   │   ├── i18n/                 ← ★ THE THREE LANGUAGES, centralized
│   │   │   │   ├── en.json           ← English text
│   │   │   │   ├── ru.json           ← Russian text
│   │   │   │   └── fa.json           ← Persian text
│   │   │   │
│   │   │   └── styles/               ← ★ COLORS & design tokens, one place
│   │   │       └── theme.css         ← all colors, fonts, spacing
│   │   │
│   │   ├── routes/                   ← the actual pages (the header's 4 doors,
│   │   │   │                            plus /register)
│   │   │   ├── +page.svelte          ← landing page ( / )
│   │   │   ├── about/
│   │   │   │   └── +page.svelte      ← About placeholder ( /about )
│   │   │   ├── register/
│   │   │   │   └── +page.svelte      ← registration form ( /register )
│   │   │   ├── dashboard/
│   │   │   │   └── +page.svelte      ← teacher dashboard ( /dashboard )
│   │   │   └── my/
│   │   │       └── +page.svelte      ← student dashboard ( /my )
│   │   │
│   │   └── app.html                  ← the HTML shell
│   │
│   ├── package.json                  ← frontend dependencies
│   └── svelte.config.js
│
├── backend/                          ← ★ EMPTY NOW — Java/Node goes here LATER
│   └── .gitkeep                      ← placeholder so the folder exists in Git
│
├── shared/                           ← ★ things frontend + backend both need
│   └── .gitkeep                      ← (data shapes, constants — filled later)
│
├── .gitignore
└── README.md                         ← repo front page (written in a later step)
```

---

## 3. Scalability — the three top-level folders

The repository is **not** "the Svelte app." It is a workspace (a *monorepo*)
containing `frontend/`, `backend/`, and `shared/`. Today, only `frontend/` has
code in it.

**Example — adding a backend later:**
The day a Java backend is needed, it goes into `backend/`, and the frontend does
not move an inch. The "place" already exists.

**Example — adding a mobile app later:**
A mobile app becomes a new `mobile/` folder right next to `frontend/`. The other
folders are untouched.

**The `.gitkeep` trick:**
Git does not save a truly empty folder. So a tiny empty file called `.gitkeep`
is placed inside `backend/` and `shared/`. This makes the folders exist in the
repo from day one — so anyone opening the project immediately sees where future
work goes.

---

## 4. Centralized & grouped — the `lib/` folder

Everything reusable lives in `frontend/src/lib/`, and each **type** of thing has
exactly one home.

### Colors — `styles/theme.css`

Every color is defined once. The (very visible) language switcher's border
color, button colors, everything.

**Example:** Change the brand color in this one file → the whole site updates.
No hunting through 20 components.

### The three languages — `i18n/`

Instead of English/Russian/Persian text scattered across every component, all
text lives in three files: `en.json`, `ru.json`, `fa.json`.

**Example:** To fix a Russian typo, open `ru.json` — one file.

> `fa` is the standard language code for Persian (Farsi). Persian also renders
> right-to-left (RTL), handled at the app level when this language is active.

### Firebase config — `config/firebase.js`

The connection to Firebase is written **once**. Both the student form and the
teacher dashboard import from this single file.

**Example:** If the Firebase keys ever change, edit one line in one place.

### Data logic — `services/`  (the scalability gem)

All the actual "save a registration" / "hide a course" logic lives here,
**separate** from the UI.

**Example — why this matters for a future backend:**
Today `registrations.js` saves directly to Firestore. Tomorrow, if a Java
backend is added, only this one file changes — to call Java instead of Firestore.
Every component that uses it keeps working, untouched. The UI never knew or
cared *where* the data went. That separation is what makes the swap painless.

---

## 5. Grouped — `components/` split by area

UI building blocks are grouped by **who uses them**:

- `components/common/` — shared everywhere (header, language switcher, buttons,
  the wrong-door notice both dashboards use).
- `components/student/` — everything the student sees: the registration form and
  course dropdown, plus their login and dashboard (Phase 13).
- `components/teacher/` — the dashboard's course manager, registration list, and
  the create/reset-login control (Phase 13).

**Example:** Anyone opening the project instantly sees what belongs to the
student side, the teacher side, or both.

> Note (Phase 13): `student/` means *"the student's side of the product"*, not
> "the public pages". The student dashboard's pieces live here next to the
> registration form, because the same person uses both.

### The SamiSphere brand — `Header.svelte` + `theme.css`

The brand name **SamiSphere** appears as a styled text *wordmark* in the site
header (`Header.svelte`), sitting next to the very-visible language switcher. No
image or logo file is needed for version 1 — the "logo" is just the word
"SamiSphere" styled with the colors and font defined in `theme.css`.

**Example:** To restyle the brand (e.g. "Sami" in one color, "Sphere" in
another), the wordmark markup lives in `Header.svelte` and its colors come from
`theme.css` — still centralized, still one place each.

> If a graphic logo (an icon/sphere image) is wanted later, it would be added as
> an SVG file in `frontend/public/` and dropped into `Header.svelte`. Deferred to
> keep version 1 simple.

---

## 6. Note on the empty folders

`backend/` and `shared/` will stay **empty** for the entire first version. This
is intentional — they are reserved "parking spaces" that signal the architecture
and where future work belongs. (Decision: keep them from day one.)

---

## 7. Summary

| Folder | Holds | Centralized? | Filled in V1? |
|---|---|---|---|
| `frontend/` | The whole SvelteKit website | — | ✅ Yes |
| `frontend/src/lib/config/` | Firebase connection | ★ One file | ✅ Yes |
| `frontend/src/lib/services/` | All data logic (Firestore today) | ★ One folder | ✅ Yes |
| `frontend/src/lib/i18n/` | English / Russian / Persian text | ★ Three files | ✅ Yes |
| `frontend/src/lib/styles/` | Colors, fonts, spacing | ★ One file | ✅ Yes |
| `frontend/src/lib/components/` | UI pieces, grouped by area | Grouped | ✅ Yes |
| `frontend/src/routes/` | Pages (`/`, `/about`, `/register`, `/dashboard`, `/my`) | — | ✅ Yes |
| `functions/` | Cloud Functions (Telegram trigger, `createStudentLogin`) | ★ One folder | ✅ Yes |
| `tests/` | Firestore security-rules tests (emulator) | ★ One folder | ✅ Yes |
| `backend/` | Future Java/Node backend | — | ❌ Empty (reserved) |
| `shared/` | Future shared data shapes/constants | — | ❌ Empty (reserved) |
| `docs/` | Planning documents | — | ✅ Yes |

---

*Next step: 03 — Project plan document.*
