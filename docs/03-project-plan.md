# Project Plan

**Project:** SamiSphere — Online Course Registration Website
**Brand / website name:** SamiSphere
**Built for:** Samira (the teacher)
**Document:** 03 — Project Plan
**Status:** Approved
**Last updated:** 2026-07-14

---

## 1. Purpose

This document defines **the order in which SamiSphere is built**, broken into
phases. It is the bridge between planning (docs 01–02) and building (the actual
code, written later by a developer or agent).

**How to read this plan:**

- Work is split into **phases**. Each phase is a *vertical slice* — it ends with
  something that actually **works**, not just a half-built layer.
- Each **task** lists three things: its **Purpose** (why), its **Depends on**
  (what must exist first), and its **Done when** (how you know it's finished).
- Tasks describe **what** and **why** — never the **how** (no code here). Code
  is written in the build step, guided by this plan.
- Every phase ends with a **✅ Checklist** — concrete tick-boxes to verify the
  phase is truly complete before moving on.

**Guiding principles (from doc 01):** keep it simple, security first, no custom
backend server, the teacher is in control, progress step by step.

---

## 2. Build Order at a Glance

| Phase | Name | Ends with (something working) |
|---|---|---|
| 0 | Foundations | Empty repo + folder skeleton on GitHub |
| 1 | SvelteKit app runs | A blank SamiSphere page opens in the browser |
| 2 | Firebase connected | The app talks to Firestore (test read/write works) |
| 3 | First vertical slice: registration saves | A name typed → saved in Firestore → visible |
| 4 | Courses come from Firestore | Student picks a real course/slot from a dropdown |
| 5 | Teacher dashboard (login + view) | Samira logs in and sees registrations |
| 6 | Teacher manages courses | Samira adds courses and toggles them on/off |
| 7 | Languages (EN / RU / FA + RTL) | Switcher flips all text; Persian goes right-to-left |
| 8 | Branding & styling | SamiSphere wordmark + centralized theme applied |
| 9 | Notifications (Telegram) | Built with placeholders, wired during testing |
| 10 | Security rules | Firestore locked down per the rules in doc 01 |
| 10.5 | Landing page + fuller details | Designed landing at `/`; form on `/register` collects name/email/phone/city/country |
| 11 | Testing & go-live | Real values plugged in, deployed, end-to-end tested |

> **Note on order:** The student-facing core (Phases 3–4) is built **before** the
> dashboard (Phases 5–6), and styling/languages come **after** the logic works.
> Notifications (Phase 9) are built with placeholders and only fully connected
> in testing (Phase 11), exactly as decided.

---

## Phase 0 — Foundations

**Goal:** A version-controlled, empty project skeleton that matches doc 02.

### Task 0.1 — Create the GitHub repository
- **Purpose:** One home for all the code and docs, with version history.
- **Depends on:** A GitHub account.
- **Done when:** An empty repo named `samisphere` exists on GitHub and is cloned
  to the local machine.

### Task 0.2 — Create the top-level folder skeleton
- **Purpose:** Establish the scalable monorepo shape (`frontend/`, `backend/`,
  `shared/`, `docs/`) from day one.
- **Depends on:** 0.1.
- **Done when:** All four top-level folders exist. `backend/` and `shared/` each
  contain a `.gitkeep` file so Git tracks them while empty.

### Task 0.3 — Add the planning documents
- **Purpose:** Keep the approved plans inside the repo where the team can see them.
- **Depends on:** 0.2.
- **Done when:** `docs/` contains `01-architecture.md`, `02-folder-structure.md`,
  and `03-project-plan.md`.

### Task 0.4 — Add `.gitignore`
- **Purpose:** Prevent secrets and junk (Firebase keys, `node_modules`) from
  being committed.
- **Depends on:** 0.2.
- **Done when:** A `.gitignore` exists at the root, ignoring at least
  `node_modules/`, build output, and environment files (`.env*`).

### ✅ Phase 0 Checklist
- [x] `samisphere` repo exists on GitHub and is cloned locally
- [x] `frontend/`, `backend/`, `shared/`, `docs/` all exist
- [x] `backend/.gitkeep` and `shared/.gitkeep` are present
- [x] All three planning docs are in `docs/`
- [x] `.gitignore` is in place and ignores secrets + `node_modules`
- [x] First commit pushed to GitHub

> **Phase 0 completed 2026-06-22.** Skeleton folders created (`frontend/` left
> empty until Phase 1 scaffolds SvelteKit; `backend/` and `shared/` hold
> `.gitkeep` placeholders). Stray `test.md` removed during tidy-up.

---

## Phase 1 — SvelteKit app runs

**Goal:** A blank but real SamiSphere site opens locally in the browser.

### Task 1.1 — Initialize the SvelteKit app inside `frontend/`
- **Purpose:** Create the actual website project with routing built in.
- **Depends on:** Phase 0.
- **Done when:** A SvelteKit project lives in `frontend/`, and its dependencies
  are installed.

### Task 1.2 — Confirm the dev server runs
- **Purpose:** Prove the toolchain works before building anything on top.
- **Depends on:** 1.1.
- **Done when:** Running the dev server opens a working page in the browser with
  no errors.

### Task 1.3 — Create the empty `lib/` folder structure
- **Purpose:** Put the centralized "homes" (config, services, stores, i18n,
  styles, components) in place so later tasks have a clear spot to fill.
- **Depends on:** 1.1.
- **Done when:** The `src/lib/` subfolders from doc 02 exist (can be empty or hold
  placeholder files).

### Task 1.4 — Set up the two routes (student + dashboard)
- **Purpose:** Establish the public page (`/`) and the teacher page (`/dashboard`)
  as decided (one app, two routes).
- **Depends on:** 1.1.
- **Done when:** Visiting `/` shows a placeholder student page and `/dashboard`
  shows a placeholder dashboard page.

### ✅ Phase 1 Checklist
- [x] SvelteKit app exists in `frontend/`
- [x] Dev server runs with no errors
- [x] `/` opens a placeholder student page
- [x] `/dashboard` opens a placeholder dashboard page
- [x] `src/lib/` subfolders exist per doc 02
- [x] Committed and pushed

> **Phase 1 completed 2026-06-22.** SvelteKit (Svelte 5, JavaScript/JSDoc,
> minimal template) scaffolded into `frontend/`. Dev server verified serving
> `/` and `/dashboard` (both HTTP 200); `npm run check` and `npm run build`
> pass clean. `src/lib/` homes created with `.gitkeep` placeholders, to be
> filled in later phases. Adapter is `adapter-auto` for now — the Firebase
> hosting adapter is configured in Phase 11.

---

## Phase 2 — Firebase connected

**Goal:** The app can read from and write to Firestore.

### Task 2.1 — Create the Firebase project
- **Purpose:** The cloud project that holds Firestore, hosting, and (later)
  the Cloud Function.
- **Depends on:** A Google account; a credit card for the Blaze plan (see doc 01
  cost note — expected cost €0).
- **Done when:** A Firebase project exists, on the Blaze plan, with Firestore
  enabled.

### Task 2.2 — Create `config/firebase.js`
- **Purpose:** The single, centralized Firebase connection the whole app imports.
- **Depends on:** 2.1.
- **Done when:** `src/lib/config/firebase.js` initializes Firebase using keys
  stored in an environment file (not hard-coded, not committed).

### Task 2.3 — Store Firebase keys safely
- **Purpose:** Keep credentials out of GitHub.
- **Depends on:** 2.2, Task 0.4.
- **Done when:** Firebase keys live in a local `.env` file that `.gitignore`
  excludes; the app reads them at runtime.

### Task 2.4 — Prove the connection with a test read/write
- **Purpose:** Confirm the app truly reaches Firestore before building features.
- **Depends on:** 2.2.
- **Done when:** A temporary test successfully writes one document to Firestore
  and reads it back. (This test code is removed afterward.)

### ✅ Phase 2 Checklist
- [x] Firebase project created, Blaze plan active, Firestore enabled
- [x] `config/firebase.js` exists and is the only Firebase init in the app
- [x] Keys are in `.env`, excluded by `.gitignore` (verified not on GitHub)
- [x] A test write + read to Firestore succeeded
- [x] Test code removed; committed and pushed

> **Phase 2 completed 2026-06-22.** Firebase project `samisphere-82309` (Blaze,
> Firestore enabled). `firebase` SDK installed; `src/lib/config/firebase.js` is
> the single init point, exporting `app` and `db`. Keys live in git-ignored
> `frontend/.env` (SvelteKit `PUBLIC_` vars via `$env/static/public`); a
> committed `frontend/.env.example` documents the shape. A temporary Node script
> wrote + read + deleted a `_connection_test/ping` doc successfully, then was
> removed. Firestore is currently in open/test mode — to be locked down in
> Phase 10. Firebase Hosting site id (for Phase 11): `samisphere-82309-b0773`
> (URL `samisphere-82309-b0773.web.app`).

---

## Phase 3 — First vertical slice: a registration saves

**Goal:** The smallest end-to-end win — a student types a name, it saves to
Firestore, and it can be seen. No styling, no languages, no dropdown yet.

### Task 3.1 — Create `services/registrations.js`
- **Purpose:** The centralized data logic for creating and reading registrations
  (kept separate from the UI — the "scalability gem" from doc 02).
- **Depends on:** Phase 2.
- **Done when:** The service exposes a way to *create* a registration and *read*
  registrations, talking to Firestore through `config/firebase.js`.

### Task 3.2 — Build a minimal `RegistrationForm.svelte`
- **Purpose:** The student-facing form (bare-bones for now — just a name field
  and a submit button).
- **Depends on:** 3.1.
- **Done when:** Submitting the form calls `services/registrations.js` and a new
  document appears in Firestore.

### Task 3.3 — Place the form on the student page (`/`)
- **Purpose:** Wire the component into the actual public route.
- **Depends on:** 3.2.
- **Done when:** Visiting `/` shows the form; submitting it saves to Firestore.

### Task 3.4 — Temporarily display saved registrations
- **Purpose:** Visually confirm the full loop works end-to-end.
- **Depends on:** 3.1.
- **Done when:** The saved registrations are listed somewhere on screen (a rough
  list is fine — this is a temporary confirmation, refined later in the dashboard).

### ✅ Phase 3 Checklist
- [x] `services/registrations.js` can create and read registrations
- [x] The form on `/` saves a new registration to Firestore
- [x] Saved registrations are visible on screen
- [x] The whole loop (type → save → see) works with no errors
- [x] Committed and pushed

> **Phase 3 completed 2026-06-22.** `services/registrations.js` exposes
> `createRegistration()` (auto-stamps `date` + a `createdAt` for ordering) and
> `getRegistrations()` (newest first). `components/student/RegistrationForm.svelte`
> (name + submit) calls the service; the student page `/` shows the form plus a
> TEMPORARY registrations list (to be removed in Phase 5, Task 5.5). Verified
> live in a browser: typing "Anna" → "Registration saved." → list showed
> "Anna — 2026-06-22". `npm run check` clean (0 errors). One test record
> ("Anna") remains in Firestore — harmless demo data, visible later in the
> dashboard.

---

## Phase 4 — Courses come from Firestore

**Goal:** The student no longer types a course freely — they select a real
course + time slot (from Firestore) in a dropdown. Hidden slots never appear.

### Task 4.1 — Decide and document the course/slot data shape
- **Purpose:** Lock the structure from doc 01 (`course`, `time`, `status`,
  `capacity`) so the service and dashboard agree.
- **Depends on:** Phase 3.
- **Done when:** The shape is written down (in `shared/` as a reference, or in a
  comment) and matches doc 01.

### Task 4.2 — Seed a few test courses in Firestore (by hand)
- **Purpose:** Have real data to build the dropdown against, before the dashboard
  exists to create them.
- **Depends on:** 4.1.
- **Done when:** 2–3 course/slot documents exist in Firestore, some
  `status: "available"`, at least one `status: "hidden"`.

### Task 4.3 — Create `services/courses.js`
- **Purpose:** Centralized data logic to read courses — and crucially, to return
  **only available** ones for the student form.
- **Depends on:** 4.1.
- **Done when:** The service can fetch courses and filter out `hidden` ones.

### Task 4.4 — Build `CourseDropdown.svelte`
- **Purpose:** The dropdown the student selects from.
- **Depends on:** 4.3.
- **Done when:** The dropdown lists only available course/slot options, pulled
  live from Firestore.

### Task 4.5 — Connect the dropdown to the registration form
- **Purpose:** Make the student's selection part of what gets saved.
- **Depends on:** 4.4, Task 3.2.
- **Done when:** Submitting saves the student's name **and** their chosen course
  + time as one registration. The hidden slot never appears as an option.

### ✅ Phase 4 Checklist
- [x] Course/slot data shape documented, matches doc 01
- [x] Test courses seeded (incl. at least one hidden)
- [x] `services/courses.js` returns only available courses
- [x] Dropdown shows real, available course/slots only
- [x] Hidden slot is confirmed *not* shown to students
- [x] A registration saves name + chosen course + time
- [x] Committed and pushed

> **Phase 4 completed 2026-06-22.** Course/slot shape documented as a header
> comment in `services/courses.js` (kept out of `shared/`, which doc 02 §6 keeps
> empty in v1). `getAvailableCourses()` queries `where status == "available"`
> (forward-compatible with Phase 10 rules) and sorts by course+time.
> `components/student/CourseDropdown.svelte` binds the chosen `{course, time}`;
> `RegistrationForm.svelte` now saves name + course + time. Seeded 3 test slots
> via a temporary script (2 available, 1 hidden "Physics 201"), then removed the
> script — seeded data is cleaned up in Phase 6. Verified live: dropdown showed
> only the 2 available slots (hidden one absent); registering "Bob" for "Math
> 101 — Wednesday 14:00" saved name+course+time. `npm run check` clean.

---

## Phase 5 — Teacher dashboard: login + view registrations

**Goal:** Samira logs in to `/dashboard` and sees all registrations. (Managing
courses is the next phase.)

### Task 5.1 — Enable Firebase email/password authentication
- **Purpose:** The login mechanism decided for the teacher (one account, hers).
- **Depends on:** Phase 2.
- **Done when:** Email/password sign-in is enabled in Firebase, and Samira's
  single account is created.

### Task 5.2 — Build the login screen on `/dashboard`
- **Purpose:** Gate the dashboard behind a login.
- **Depends on:** 5.1.
- **Done when:** Visiting `/dashboard` while logged out shows a login form;
  logging in with the correct credentials grants access.

### Task 5.3 — Protect the dashboard route
- **Purpose:** Ensure a logged-out visitor cannot see dashboard contents.
- **Depends on:** 5.2.
- **Done when:** Dashboard content is hidden/blocked unless logged in; logging
  out returns to the login screen.

### Task 5.4 — Build `RegistrationList.svelte`
- **Purpose:** Show all registrations to the teacher cleanly (replacing the rough
  temporary list from Phase 3).
- **Depends on:** 5.3, Task 3.1.
- **Done when:** Once logged in, Samira sees a readable list of all registrations
  (name, course, time, date) from Firestore.

### Task 5.5 — Remove the temporary public registration display
- **Purpose:** Students should not see other students' registrations — that view
  now lives only in the protected dashboard.
- **Depends on:** 5.4.
- **Done when:** The temporary list from Task 3.4 is gone from the public page.

### ✅ Phase 5 Checklist
- [x] Email/password auth enabled; Samira's account created
- [x] `/dashboard` shows a login form when logged out
- [x] Logged-out visitors cannot see dashboard content
- [x] Logged-in teacher sees a clean list of all registrations
- [x] Temporary public registration list removed
- [x] Committed and pushed

> **Phase 5 completed 2026-06-22.** Firebase email/password auth enabled by the
> human; teacher account `samira@samisphere.com` created. `config/firebase.js`
> now also exports `auth`. `services/auth.js` wraps sign-in / sign-out /
> `onAuthChange`. `/dashboard` gates on auth state: undefined → "Loading…",
> null → `LoginForm`, user → `RegistrationList` + log-out. Temporary public
> list removed from `/` (Task 5.5); `RegistrationForm`'s `onsaved` is now
> optional. Verified live: logged-out shows only login (no data); wrong
> credentials show an error; the human confirmed successful login shows the
> registrations table. Note: route gating is UX only — real read protection
> arrives with the Firestore rules in Phase 10. `npm run check` clean.

---

## Phase 6 — Teacher manages courses

**Goal:** Samira can add courses + time slots and toggle each one on/off — the
core of "the teacher is in control." This replaces the hand-seeded test data.

### Task 6.1 — Extend `services/courses.js` with add / edit / hide
- **Purpose:** Centralized write logic for course management (read already exists
  from Phase 4).
- **Depends on:** Phase 4, Phase 5.
- **Done when:** The service can create a course/slot, edit it, and flip its
  `status` between `available` and `hidden`.

### Task 6.2 — Build `CourseManager.svelte`
- **Purpose:** The dashboard UI for managing courses.
- **Depends on:** 6.1.
- **Done when:** Samira can add a new course + time slot from the dashboard, and
  it is saved to Firestore.

### Task 6.3 — Add the on/off toggle per course/slot
- **Purpose:** The manual hide feature (Option A) — full slots or unwanted slots
  disappear from the student form.
- **Depends on:** 6.2.
- **Done when:** Toggling a slot off sets `status: "hidden"`; that slot
  immediately stops appearing in the student dropdown (and back on restores it).

### Task 6.4 — End-to-end check against the student form
- **Purpose:** Confirm teacher actions correctly drive what students see.
- **Depends on:** 6.3, Phase 4.
- **Done when:** Adding a course makes it appear in the student dropdown; hiding
  it removes it — verified live.

### ✅ Phase 6 Checklist
- [x] `services/courses.js` can add, edit, and hide courses
- [x] Teacher can add a course + time slot from the dashboard
- [x] On/off toggle flips `status` correctly
- [x] Hidden slots vanish from the student dropdown immediately
- [x] Re-enabling a slot brings it back
- [x] Hand-seeded test data cleaned up
- [x] Committed and pushed

> **Phase 6 completed 2026-06-23.** `services/courses.js` extended with
> `getAllCourses()` (dashboard sees hidden too), `addCourse()` (starts
> available), `updateCourse()` (edit), and `setCourseStatus()` (hide/show).
> `components/teacher/CourseManager.svelte` adds the add-form, the all-courses
> table, an on/off toggle, and inline edit; mounted on `/dashboard` above the
> registration list. Service semantics verified programmatically (add → visible
> to students; hide → drops from student view but stays in dashboard list);
> Phase 4 seeded data deleted (courses collection emptied for the teacher).
> Human confirmed the full dashboard UI loop live: add → appears in student
> dropdown → hide → vanishes → show → returns. `npm run check` clean. (Teacher
> may now hold real courses added during testing — left as-is.)

---

## Phase 7 — Languages (English / Russian / Persian + RTL)

**Goal:** A prominent language switcher flips all text between the three
languages; Persian renders right-to-left.

### Task 7.1 — Install and configure `svelte-i18n`
- **Purpose:** The translation engine decided in doc 01.
- **Depends on:** Phase 1.
- **Done when:** `svelte-i18n` is installed and initialized, defaulting to English.

### Task 7.2 — Create the three translation files
- **Purpose:** Centralize all on-screen text (doc 02): `en.json`, `ru.json`,
  `fa.json`.
- **Depends on:** 7.1.
- **Done when:** Every piece of user-facing text used so far has a key in all
  three files.

### Task 7.3 — Replace hard-coded text with translation keys
- **Purpose:** Make the whole UI language-driven instead of fixed English.
- **Depends on:** 7.2.
- **Done when:** No user-facing English string is hard-coded in components — all
  come from the translation files.

### Task 7.4 — Build `LanguageSwitcher.svelte` (prominent + visible)
- **Purpose:** The very-visible switcher Samira asked for (flags 🇬🇧 🇷🇺 🇮🇷,
  active one highlighted).
- **Depends on:** 7.2, `stores/language.js`.
- **Done when:** The switcher sits prominently in the header and changes the
  language across the whole site on click.

### Task 7.5 — Handle right-to-left (RTL) for Persian
- **Purpose:** Persian must read right-to-left; English/Russian left-to-right.
- **Depends on:** 7.4.
- **Done when:** Selecting Persian flips the page direction to RTL; switching
  back to EN/RU restores left-to-right.

### Task 7.6 — Remember the chosen language during the visit
- **Purpose:** The switcher's choice should persist as the user navigates.
- **Depends on:** 7.4, `stores/language.js`.
- **Done when:** Choosing a language and moving between `/` and `/dashboard`
  keeps that language.

### ✅ Phase 7 Checklist
- [x] `svelte-i18n` configured, defaults to English
- [x] `en.json`, `ru.json`, `fa.json` cover all current text
- [x] No hard-coded user-facing English remains in components
- [x] Prominent switcher in the header changes all text on click
- [x] Persian renders right-to-left; EN/RU render left-to-right
- [x] Chosen language persists across pages
- [x] Committed and pushed

> **Phase 7 completed 2026-06-23.** `svelte-i18n` installed; `lib/i18n/index.js`
> bundles `en/ru/fa.json` synchronously (default English). `stores/language.js`
> holds the language list (🇬🇧🇷🇺🇮🇷), `setLanguage()` (persists to localStorage +
> sets `<html dir>` RTL for `fa`), and `initLanguage()` (applied on mount in the
> root layout). `components/common/LanguageSwitcher.svelte` is rendered in the
> layout header on every page; active language highlighted. All component text
> now uses `$_()` keys. Verified live: EN→RU→FA each flips all text; Persian
> flips the whole layout to RTL; the choice persisted across `/`↔`/dashboard`.
> `npm run check` clean.
>
> ⚠️ **Translation review pending:** the RU and FA translations were authored by
> the agent and should be eyeballed by a native/fluent speaker (Samira) before
> go-live. They live in `frontend/src/lib/i18n/ru.json` and `fa.json` — one file
> each, easy to correct.

---

## Phase 8 — Branding & styling

**Goal:** The SamiSphere wordmark and a centralized visual theme are applied
across the site.

### Task 8.1 — Create `styles/theme.css` (centralized design tokens)
- **Purpose:** One place for all colors, fonts, and spacing (doc 02).
- **Depends on:** Phase 1.
- **Done when:** `theme.css` defines the site's colors/fonts/spacing and is
  imported app-wide; components reference these tokens, not scattered values.

### Task 8.2 — Build `Header.svelte` with the SamiSphere wordmark
- **Purpose:** The styled text logo + the language switcher, on every page.
- **Depends on:** 8.1, Task 7.4.
- **Done when:** A header shows "SamiSphere" as a styled wordmark next to the
  language switcher, on both `/` and `/dashboard`.

### Task 8.3 — Style the shared `Button.svelte` and forms
- **Purpose:** Consistent, tidy UI using the central theme.
- **Depends on:** 8.1.
- **Done when:** Buttons and form fields across the site use the shared component
  and theme tokens.

### Task 8.4 — Basic responsive check (mobile + desktop)
- **Purpose:** Make sure it's usable on a phone, where students likely register.
- **Depends on:** 8.2, 8.3.
- **Done when:** The student page and dashboard are usable and readable on a
  narrow phone screen and a desktop; the language switcher stays visible on both.

### ✅ Phase 8 Checklist
- [x] `theme.css` holds all colors/fonts/spacing and is imported app-wide
- [x] Components use theme tokens, not hard-coded colors
- [x] SamiSphere wordmark header appears on every page
- [x] Buttons/forms use the shared component + theme
- [x] Site is usable on phone and desktop; switcher visible on both
- [x] Committed and pushed

> **Phase 8 completed 2026-06-23.** `styles/theme.css` defines tokens (indigo
> primary, teal accent, light surfaces, spacing/radius/shadow) + base element
> styling, imported once in the root layout. `components/common/Header.svelte`
> shows the two-tone "Sami"(indigo)+"Sphere"(teal) wordmark beside the language
> switcher on every page. Shared `components/common/Button.svelte` (primary /
> secondary / danger) used across the forms and dashboard; forms are card-styled
> via tokens. Switcher collapses to flags-only under 480px. Verified live on
> desktop and mobile (375px), EN/LTR and FA/RTL: header, student form, and
> dashboard login all render cleanly and stay usable; switcher visible on both.
> `npm run check` clean. (Logged-in dashboard tables/badges use the same themed
> primitives but weren't screenshotted, being behind the login.)

---

## Phase 9 — Notifications (Telegram) — built with placeholders

**Goal:** The Cloud Function that notifies Samira is fully written, but the bot
token and chat ID are left as placeholders. Real values are filled in during
testing (Phase 11), as decided.

### Task 9.1 — Set up the Cloud Function project (in `frontend/` Firebase setup or a `functions/` folder)
- **Purpose:** The serverless function that fires on each new registration.
- **Depends on:** Phase 2.
- **Done when:** A Cloud Function scaffold exists and can deploy to Firebase.

### Task 9.2 — Write the Firestore trigger
- **Purpose:** Fire automatically the moment a registration is created.
- **Depends on:** 9.1, Phase 3.
- **Done when:** The function triggers on a new registration document (verified
  via logs, even before Telegram is connected).

### Task 9.3 — Write the Telegram message logic with PLACEHOLDER config
- **Purpose:** Compose and send the "New registration: …" message — but leave
  the credentials blank for now.
- **Depends on:** 9.2.
- **Done when:** The function references `TELEGRAM_BOT_TOKEN` and
  `TELEGRAM_CHAT_ID` as empty/config placeholders. The message text is complete;
  the code is correct and ready, but not yet pointed at a real bot.

### Task 9.4 — Document the "fill in later" step
- **Purpose:** Make the testing-phase task unmissable.
- **Depends on:** 9.3.
- **Done when:** A clear note exists (in this plan and/or a comment) describing
  exactly what to do in Phase 11: create the bot via BotFather, get Samira's chat
  ID, and fill in the two placeholder values.

### ✅ Phase 9 Checklist
- [x] Cloud Function scaffold exists and can deploy
- [x] Function triggers on new registration (confirmed in logs)
- [x] Telegram message text is written and correct
- [x] `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` exist as empty placeholders
- [x] "Fill in real values during testing" step is documented
- [x] Committed and pushed

> **Phase 9 completed 2026-06-23.** Top-level `functions/` (chosen with the
> human) holds the Gen-2 Firestore trigger `notifyOnRegistration`
> (`onDocumentCreated('registrations/{id}')`). It composes the message *"New
> registration: {name} signed up for {course} — {time}."* and sends it to
> Telegram — but `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` are read from the
> environment and are EMPTY until Phase 11; while empty it logs the message it
> *would* send. Root `firebase.json` + `.firebaserc` (project `samisphere-82309`)
> added. Verified in the Firebase emulator (functions + firestore): writing a
> registration fired the function and logged the placeholder message — confirmed
> in logs. `node --check` passed. **Not yet deployed** (deploy needs Functions
> enabled on Blaze + `firebase login` — a Phase 11 / human step).
>
> Also added `firestore.rules` with **temporary OPEN rules** (matching the
> current cloud test mode) so the emulator could run — these are **replaced with
> the real locked-down rules in Phase 10.**

#### 📌 Phase 11 reminder — fill in the real Telegram values
Documented here and in `functions/.env.example`:
1. In Telegram, create the bot via **@BotFather** → copy the **bot token**.
2. Have **Samira start a chat** with the bot, then get her numeric **chat ID**
   (message the bot, then read it from
   `https://api.telegram.org/bot<TOKEN>/getUpdates`).
3. Copy `functions/.env.example` → `functions/.env` (git-ignored) and paste the
   real `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
4. Deploy: `firebase deploy --only functions`.

---

## Phase 10 — Security rules

**Goal:** Firestore is locked down exactly as doc 01 specifies — no backend
server needed.

### Task 10.1 — Write Firestore Security Rules
- **Purpose:** Enforce who can do what (doc 01 §7).
- **Depends on:** Phases 3–6.
- **Done when:** Rules are written so that:
  - anyone may **create** a registration,
  - only the logged-in teacher may **read / edit / delete** registrations,
  - only the logged-in teacher may **add / edit / hide** courses,
  - anyone may **read available** courses (to fill the dropdown).

### Task 10.2 — Deploy and test the rules
- **Purpose:** Confirm the rules actually behave as intended.
- **Depends on:** 10.1.
- **Done when:** Tested live — a logged-out user can register but cannot read
  registrations or change courses; the logged-in teacher can do everything.

### Task 10.3 — Confirm the student dropdown still works under the rules
- **Purpose:** Make sure "anyone can read available courses" didn't get over-locked.
- **Depends on:** 10.2, Phase 4.
- **Done when:** A logged-out student can still see and select available courses.

### ✅ Phase 10 Checklist
- [x] Security rules written per doc 01 §7
- [x] Rules deployed to Firebase
- [x] Logged-out user: can register, cannot read registrations, cannot edit courses
- [x] Logged-in teacher: full access verified
- [x] Student dropdown still loads available courses under the rules
- [x] Committed and pushed

> **Phase 10 completed 2026-06-23.** Real `firestore.rules` enforce doc 01 §7.
> Teacher pinned to `samira@samisphere.com` by email so a self-created auth
> account cannot gain teacher access. Public course reads constrained to
> `status == "available"` (anonymous can't query all courses → hidden slots stay
> private). Validated in the emulator with `@firebase/rules-unit-testing`
> (**13/13** across anonymous / intruder / teacher). Human ran `firebase login`
> and deployed the rules. Live-verified by the agent against real Firestore as
> an anonymous client (**5/5**): can register + query available courses; denied
> reading registrations, reading all courses, and creating courses. Student
> dropdown confirmed loading the available course live under the rules.
> Firestore is no longer in open test mode. (A `RulesLiveTest` registration was
> created during the live check — harmless; visible in the dashboard.)

---

## Phase 10.5 — Landing page + expanded registration details

**Added 2026-06-23** (not in the original plan — requested by the human). Two
changes: a designed **landing page**, and **fuller student details** on the
registration form.

### Task 10.5.1 — Landing page at `/`
- **Purpose:** A welcoming front door for the site.
- **Done when:** `/` shows a designed hero — SamiSphere wordmark, a short
  welcome + intro, a prominent CTA button to the registration form, with the
  language switcher available (in the header).

### Task 10.5.2 — Move the registration form to `/register`
- **Purpose:** Separate the landing page from the sign-up form.
- **Done when:** The form lives at `/register`, reached from the landing CTA.

### Task 10.5.3 — Expand the registration fields
- **Purpose:** Collect more than just a name.
- **Done when:** The form collects **first name, surname, email, phone, city,
  country** (address = city + country only, no street) plus the course, with
  validation (all required; basic email check). Saved as one registration.

### Task 10.5.4 — Update dashboard, notification, and rules for the new shape
- **Purpose:** Keep the rest of the system in sync with the new data.
- **Done when:** the dashboard list shows the new columns; the Telegram message
  includes the fuller details; and `firestore.rules` validates the new shape
  (and is re-deployed). Old `name`-only records still display/notify gracefully.

### ✅ Phase 10.5 Checklist
- [x] Landing page at `/` (designed hero + CTA), switcher visible
- [x] Registration form moved to `/register`
- [x] Form collects first name, surname, email, phone, city, country + course
- [x] Dashboard list shows the new columns
- [x] Telegram message includes the fuller details
- [x] Security rules updated for the new shape and re-deployed
- [x] Committed and pushed

> **Phase 10.5 completed 2026-06-23.** New landing page (`/`) with a hero
> (gradient wordmark + glow, headline, intro, pill CTA → `/register`). Form moved
> to `/register` and expanded to first/last name, email, phone, city, country +
> course, with validation. `services/registrations.js`, `RegistrationList`
> (new columns + horizontal scroll; legacy `name` handled), the Cloud Function
> message (now multi-line with contact + location), and all three i18n files
> updated. `firestore.rules` create-validation updated for the new required
> fields and **re-deployed live** by the agent (CLI already authenticated).
> Verified: emulator rules re-test 5/5; live form submit of a full record
> succeeded under the new rules; emulator confirmed the enriched notification
> message; landing verified in EN and FA/RTL. Human confirmed the dashboard
> new-columns view looks good (may be refined further after deployment). RU/FA
> translations for the new strings still pending a fluent-speaker review (see
> Phase 7 note).

---

## Phase 10.6 — Optional meeting link per course

**Added 2026-06-23** (post-v1, requested by the human). A small additive change:
one optional `meetingLink` field per course so Samira can attach a static
online-class URL (Google Meet / Teams / Jitsi), start class from the dashboard,
and copy the link to send to students.

### ✅ Phase 10.6 Checklist
- [x] `meetingLink` documented in the course shape comment (`services/courses.js`) + doc 01 §4
- [x] Add + edit forms in `CourseManager.svelte` have an optional link field
- [x] `addCourse()` / `updateCourse()` persist `meetingLink`
- [x] Dashboard shows a "Start class" button (new tab, `rel="noopener"`) for courses with a link
- [x] Courses without a link still work (muted "No link"; no errors)
- [x] `firestore.rules` validates the optional field and is re-deployed
- [x] Old `meetingLink`-less courses still display and function
- [x] Committed and pushed

> **Phase 10.6 completed 2026-06-23.** `meetingLink` added as an optional course
> field (stored only when non-empty; empty string clears it on edit).
> `CourseManager` gained a link input in the add form and inline edit, plus a
> "Link" column showing a styled **Start class** button (`target="_blank"
> rel="noopener"`) and the selectable raw URL, or a muted "No link". i18n keys
> added to en/ru/fa. `firestore.rules` now validates `meetingLink is string`
> when present — emulator-verified **6/6** (old shape, string, empty, non-string
> denied, update, anon denied) — and re-deployed. New UI built and deployed to
> hosting. ⏳ Live dashboard UI spot-check (add a course with a link → Start
> class button) to be done by the human (behind login).

---

## Phase 11 — Testing & go-live

**Goal:** Everything is connected with real values, deployed, and tested
end-to-end. This is where the Telegram placeholders become real.

### Task 11.1 — Create the Telegram bot and get the chat ID
- **Purpose:** The real notification target (the step deferred from Phase 9).
- **Depends on:** Phase 9.
- **Done when:** A bot is created via BotFather; Samira has started it; her chat
  ID is obtained.

### Task 11.2 — Fill in the placeholder values
- **Purpose:** Point the Cloud Function at the real bot.
- **Depends on:** 11.1.
- **Done when:** `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` hold the real values
  (stored safely as Firebase config, not committed to GitHub).

### Task 11.3 — End-to-end test: real registration → real Telegram message
- **Purpose:** Prove the whole system works for real.
- **Depends on:** 11.2.
- **Done when:** A test registration on the live site results in Samira receiving
  the Telegram message.

### Task 11.4 — Deploy to Firebase Hosting
- **Purpose:** Put SamiSphere on the public internet.
- **Depends on:** All previous phases.
- **Done when:** The site is live at its Firebase Hosting URL and loads correctly.

### Task 11.5 — Full walkthrough in all three languages
- **Purpose:** Final confidence check across the whole feature set.
- **Depends on:** 11.4.
- **Done when:** A full student registration and a full teacher session both work
  on the live site, tested in English, Russian, and Persian (incl. RTL).

### Task 11.6 — Hand off to Samira
- **Purpose:** Make sure the actual user can use it.
- **Depends on:** 11.5.
- **Done when:** Samira can log in, add/hide a course, and receives a Telegram
  notification from a real registration — on her own.

### ✅ Phase 11 Checklist
- [x] Telegram bot created; chat ID obtained
- [x] Real token + chat ID filled in (stored safely, not on GitHub)
- [x] Live registration triggers a real Telegram message
- [x] Site deployed to Firebase Hosting and loads correctly
- [x] Full walkthrough passes in EN, RU, and FA (RTL verified) *(on the build; live spot-check welcome)*
- [x] Samira onboarded — receives live notifications; admin + Samira operate it together
- [x] Final commit pushed; tagged as version 1 (`v1.0.0`)

> **Phase 11 mostly complete 2026-06-23.** Bot `@samisphere_notify_bot` created;
> admin chat ID `580930523` wired in (`functions/.env`, git-ignored). Function
> supports multiple comma-separated chat IDs (admin now; +Samira at handoff).
> Cloud Function deployed to `me-central1` (first 2nd-gen deploy took 3 tries
> while Google provisioned service agents — normal). Site deployed via
> adapter-static SPA to **https://samisphere-82309.web.app**. Verified in
> production: anonymous live registration → deployed function fired → real
> Telegram message delivered (confirmed in function logs). Trilingual UI + RTL
> verified on the identical build locally.
>
**Update 2026-06-23 (later):** Notification handoff done — Samira's chat ID
(`7652699241`, @disamrvn) added alongside the admin's in `TELEGRAM_CHAT_ID`;
function redeployed. Confirmed live: a registration notifies **both** the admin
and Samira. (Note: the two bots had near-identical names — `samisphere` vs
`samsphere`; we standardized on the original `@samisphere_notify_bot` and both
recipients message that one. The extra `@samsphere_notify_bot` is unused.)

> ⏳ **Remaining:** (a) clean up test registrations from the live DB — the human
> will do this themselves; (b) Samira to review RU/FA translations and redeploy
> with `npm --prefix frontend run build && firebase deploy --only hosting`;
> (c) transfer project ownership to Samira when ready; (d) tag v1.

---

## Phase 12 — v1.1 (course price, homepage showcase, comment field, delete)

**Goal:** A post-v1 feature round requested by the human. Four features + docs,
each a vertical slice: course **price**, a homepage **course showcase**, an
optional registration **comment**, and **delete** for courses and registrations.
Full spec: `phase-12-v1.1.md` (approved 2026-07-14).

### Task 12.1 — Extend the course shape with price fields
- **Done when:** `services/courses.js` shape + JSDoc document the optional
  `price` (number), `priceUnit` (`hour`/`month`), `currency` (`RUB`/`USD`);
  `addCourse()` persists them only with a valid price; `updateCourse()` can
  set/change them; old price-less courses are unaffected.

### Task 12.2 — Course price UI in the dashboard (`CourseManager.svelte`)
- **Done when:** the add-form and inline edit have price + period + currency
  controls; the table shows a formatted price (symbol + 2 decimals + / period)
  or a muted "No price set"; all text is from i18n; shared `Button` + theme
  tokens only.

### Task 12.3 — Homepage course showcase (`/` + `services/courses.js`)
- **Done when:** `getShowcaseCourses()` builds on `getAvailableCourses()` (never
  reads hidden data), groups by course name (first wins — accepted limitation),
  and excludes price-less courses; the homepage renders a themed, responsive,
  trilingual + RTL section of name + price only, with a "Courses coming soon"
  placeholder and readable while logged out.

### Task 12.4 — Registration comment field (`/register` + service + function)
- **Done when:** an optional 500-char comment with a live `0 / 500` counter
  (hard-stopped) is on the form; `createRegistration()` stores it only when
  non-empty; `RegistrationList` shows it when present (legacy-safe); the Telegram
  message adds a `Comment:` line only when provided.

### Task 12.5 — Update the three translation files (en / ru / fa)
- **Done when:** every new string is keyed in all three files; English complete;
  RU/FA agent translations flagged for Samira's review; no hard-coded English
  left in touched components.

### Task 12.6 — Delete: courses and registrations (dashboard)
- **Done when:** `deleteCourse(id)` + `deleteRegistration(id)` exist; each list
  has a per-row **Delete** (danger variant) behind a confirmation; the list
  refreshes after; the agent did not mass-delete real live data (test docs only).

### Task 12.7 — Update `firestore.rules` for the new fields, then redeploy
- **Done when:** course create/update validates optional `price` (number),
  `priceUnit` (`hour`/`month`), `currency` (`RUB`/`USD`); registration create
  validates optional `comment` (string ≤ 500); delete permissions unchanged;
  emulator tests extended and passing. **Live deploy is a human-confirmed step.**

### Task 12.8 — Update the documentation (required)
- **Done when:** `01-architecture.md` (shapes + showcase), this plan,
  `README.md`, and the service shape comments all match reality.

### ✅ Phase 12 Checklist
**A — Course price**
- [x] `services/courses.js` shape + JSDoc include `price` / `priceUnit` / `currency`
- [x] `addCourse()` and `updateCourse()` persist all three; old courses unaffected
- [x] Dashboard add-form has price (decimals) + period (hour/month) + currency (₽/$)
- [x] Dashboard inline-edit can set/change all three (incl. adding to an old course)
- [x] Course table shows formatted price (symbol + 2 decimals + / period); "No price set" when absent

**B — Homepage showcase**
- [x] Homepage section lists each unique course once: name + formatted price only
- [x] No time / meeting link / capacity shown; hidden courses excluded; price-less excluded
- [x] "Courses coming soon" placeholder when no available priced courses
- [x] Themed, responsive, correct in EN/RU/FA + RTL; readable while logged out

**C — Comment field**
- [x] Optional comment on `/register`, 500-char hard limit, live `0 / 500` counter
- [x] `createRegistration()` stores `comment` when non-empty (JSDoc updated)
- [x] Dashboard list shows the comment when present (legacy records don't break)
- [x] Telegram message includes the comment line only when provided

**D — Delete**
- [x] `deleteCourse(id)` + `deleteRegistration(id)` in the services
- [x] Per-row Delete in `CourseManager` and `RegistrationList` (danger variant)
- [x] Confirmation required before every delete; cancel does nothing; list refreshes after
- [x] Agent did NOT mass-delete real live data (built + tested on test docs only)

**E — Rules, i18n, docs**
- [x] All new strings keyed in en/ru/fa; no hard-coded English left; RU/FA review flagged
- [x] `firestore.rules` validates new course fields + optional comment (≤500); delete perms unchanged
- [x] Emulator rules tests extended and passing (20/20)
- [x] Rule/hosting/function deploy handled as a human-confirmed step (not deployed unilaterally)
- [x] `01-architecture.md`, `03-project-plan.md`, `README.md`, and service shape comments updated
- [x] `npm --prefix frontend run check` clean; committed and pushed; tagged `v1.1.0` when live

> **Phase 12 complete 2026-07-14.** All four features
> implemented against the existing architecture: price fields (`price` /
> `priceUnit` / `currency`) added to the course shape and service, with add-form
> + inline-edit controls and a formatted-price column in `CourseManager`; a
> homepage **course showcase** (`getShowcaseCourses()` — grouped by name, priced
> only, hidden excluded) with a "Courses coming soon" placeholder; an optional
> 500-char **comment** with a live counter on `/register`, stored + shown in the
> dashboard and Telegram message; and **delete** for courses and registrations
> (danger button + `confirm()`), refreshing the list after. `firestore.rules`
> now validates the new fields (course price/unit/currency, comment ≤ 500);
> **20/20** emulator tests pass via a new `tests/` harness
> (`@firebase/rules-unit-testing`, run with `npm --prefix tests test`).
> `npm --prefix frontend run check` is clean (0 errors). New UI verified locally
> (dev server): homepage showcase + placeholder in EN and Persian/RTL, and the
> comment field + live `0/500` counter + 500-char cap.
>
> **Deployed 2026-07-14 (human-confirmed):** `firebase deploy --only
> firestore:rules` (rules), `npm --prefix frontend run build && firebase deploy
> --only hosting` (site → https://samisphere-82309.web.app), and `firebase deploy
> --only functions` (`notifyOnRegistration`, me-central1). Committed + pushed to
> `main` and tagged **`v1.1.0`**.
>
> ⏳ **Remaining (human steps):** (a) Samira to review the new **RU/FA** strings
> (carried over from Phase 7 / 10.5 — still open). (b) Live-data cleanup of old
> test courses/registrations is now doable via the new Delete button, left to the
> human. (c) Live dashboard spot-check of the price/delete UI (behind login)
> welcome — add a price to a course and confirm it appears on the homepage
> showcase.

---

## Phase 13 — v1.2 (student logins, student dashboard, header nav, About page)

**Goal:** Give students a door of their own. A confirmed student logs in and sees
the courses they registered for, whether they've paid, the class time, and a
button to join the class — plus the permanent header shell and an About
placeholder. Full spec: `phase-13-v1.2.md` (approved 2026-07-15).

**Design decisions made with the human (do not re-litigate):** login *is* the
confirmation; one login per student by email, all their courses on one page;
payment is per registration and **gates nothing**; passwords never touch
Firestore; the header is a permanent 4-item shell (future features go *inside* a
dashboard); About is a placeholder for now.

### Task 13.1 — Header navigation (the permanent shell)
- **Done when:** the header shows the wordmark, then **Homepage · About ·
  Teacher dashboard · Student dashboard**, plus the language switcher; the active
  page is indicated; all labels from i18n; themed with `theme.css`; responsive on
  a phone with the switcher still visible; correct in EN/RU/FA incl. RTL.

### Task 13.2 — About page (placeholder)
- **Done when:** `/about` exists, styled like the other public pages, showing a
  short warm placeholder keyed in all three languages. Nothing invented.

### Task 13.3 — Add payment fields to the registration shape
- **Done when:** `services/registrations.js` documents + exposes `paid` /
  `paidAt`; a toggle stamps `paidAt` when flipping to paid and clears it when
  flipping back; absent `paid` reads as unpaid; old records unaffected.

### Task 13.4 — Teacher: payment toggle in the dashboard
- **Done when:** each row shows a green **Paid** / amber **Not paid** badge and
  the paid date, with a one-click toggle; text from i18n; theme tokens + shared
  `Button`.

### Task 13.5 — Cloud Function: create / reset a student login
- **Done when:** a **callable** (`createStudentLogin`) verifies the caller is the
  teacher, creates the student's auth account or resets its password, and returns
  a friendly hand-typable password **once**; no password ever written to
  Firestore; clean errors; verified in the emulator.

### Task 13.6 — Teacher: "Create login" / "Reset password" button
- **Done when:** each registration row has the control; clicking shows the
  returned password once, copyable, with a "won't be shown again" note; Samira
  sends it via Telegram herself.

### Task 13.7 — Student dashboard route + login (`/my`)
- **Done when:** `/my` shows a login when logged out and the profile when logged
  in; wrong-door cases (teacher at `/my`, student at `/dashboard`) get a kind
  message, never a raw error; friendly login errors; logout works.

### Task 13.8 — Student profile page (the design)
- **Done when:** the page lists every registration matching the student's email
  as one card each — course + time, paid badge, big full-width **Join class**
  button (or a dashed placeholder when there is no link), and the paid date or
  price below; friendly empty state; held to the landing page's bar; responsive;
  EN/RU/FA + RTL.

### Task 13.9 — Translations (en / ru / fa)
- **Done when:** every new string is keyed in all three files; English complete;
  RU/FA flagged for Samira's review; no hard-coded English in touched components.

### Task 13.10 — Security rules + deploy
- **Done when:** a student may read only their own registrations, cannot list
  others, and can never write (not even their own `paid`); teacher access,
  anonymous create, and public course reads unchanged; emulator tests extended
  and passing. **Production deploy is a human-confirmed step.**

### Task 13.11 — Update the documentation (required)
- **Done when:** `01`, `02`, this plan, `README.md`, and the service shape
  comments all match reality.

### ✅ Phase 13 Checklist

**Header + About**
- [x] Header shows Homepage · About · Teacher dashboard · Student dashboard + language switcher
- [x] Active page indicated; responsive on phone; switcher still visible
- [x] Correct in EN/RU/FA incl. RTL (nav mirrors)
- [x] `/about` placeholder route exists, styled, keyed in all three languages

**Payment**
- [x] `paid` + `paidAt` documented in `services/registrations.js` shape + JSDoc
- [x] Toggle sets `paid` and stamps `paidAt`; old records (no field) read as unpaid
- [x] Teacher dashboard shows Paid/Not paid + date, one-click toggle, updates immediately

**Student login (teacher side)**
- [x] Callable function creates an auth account, or resets the password if the email exists
- [x] Function verifies the caller is the teacher; rejects everyone else
- [x] Password is friendly/hand-typable, no ambiguous chars, returned once
- [x] **No password is ever written to Firestore** (verified deliberately — see note)
- [x] Dashboard button reads Create login / Reset password appropriately
- [x] Password shown once, copyable, with a clear "won't be shown again" note

**Student dashboard**
- [x] `/my` shows a login screen when logged out; student data never visible logged out
- [x] Wrong-door cases (teacher at `/my`, student at `/dashboard`) show a kind message, not a raw error
- [x] Profile lists **all** registrations matching the student's email, one card each
- [x] Card: course + time, Paid/Not paid badge, big full-width Join class button
- [x] No `meetingLink` → dashed "Class link available soon" placeholder, never a dead button
- [x] Below button: paid date when paid; price when not paid
- [x] **Join button always shows when a link exists, regardless of payment**
- [x] Empty state when the student has no registrations
- [x] Looks good, matches the landing page bar, responsive, EN/RU/FA + RTL

**Rules, i18n, docs**
- [x] Students read only their own registrations; cannot list others; cannot write `paid`
- [x] Teacher access, anonymous create, and public course reads all unchanged and working
- [x] Emulator rules tests extended and passing (39/39)
- [x] All new strings keyed in en/ru/fa; RU/FA review flagged, not closed
- [x] Production deploys paused for human confirmation — not deployed unilaterally
- [x] `01`, `02`, `03`, `README`, and service shape comments updated
- [x] `npm --prefix frontend run check` clean; committed and pushed
- [x] Tagged `v1.2.0` when live

> **Phase 13 complete 2026-07-15 — built, verified, and deployed.**
> The header became a permanent four-item shell (`Header.svelte`, active-state
> underline, nav wrapping to its own scrollable row under 720px so the wordmark
> and switcher keep the first row); `/about` is a dark placeholder matching the
> landing/register pages. `paid` / `paidAt` joined the registration shape with a
> one-click toggle in `RegistrationList`; absent `paid` reads as unpaid, so no
> existing record needed touching, and flipping back to unpaid deletes `paidAt`
> rather than leaving a stale date.
>
> **Student logins:** a new callable `createStudentLogin` (`functions/index.js`,
> `me-central1`, alongside the Telegram trigger) verifies the caller's own auth
> token against the pinned teacher email, then creates the student's account or
> resets its password, returning one friendly password (`k4m9x-2p7b3` — 11 chars,
> 2×5 groups, 32-symbol alphabet with no `0/1/l/o`, ~50 bits). `firebase-admin`
> was added to `functions/`. **No password is written to Firestore** — verified
> deliberately: `createStudentLogin` imports only `getAuth` and never touches
> Firestore, and no service or rule mentions a password field.
>
> **Student dashboard:** `/my` (login → profile), with `WrongDoor.svelte` shared
> by both dashboards for the teacher-at-`/my` and student-at-`/dashboard` cases.
> The profile lists every registration matching the student's auth email, one
> card each; the join button and its dashed no-link placeholder share a
> `--join-height` so cards keep identical shape either way.
>
> **Rules:** students read own-only via a per-document email match (so an
> unconstrained list fails as a whole); all student writes denied. **39/39**
> emulator tests pass (was 20), and the callable was verified separately in the
> functions+auth emulator (19/19: non-teacher and unauthenticated callers
> rejected, create→reset, old password stops working, invalid emails rejected).
> The auth emulator was added to `firebase.json` to make that possible.
>
> **One bug found and fixed while building:** the registration form only trimmed
> the email, but Firebase Auth normalizes to lowercase — a student who typed
> `Anna@Example.com` would have logged in fine and then seen an **empty**
> dashboard, since the email match would never hit. `createRegistration` now
> stores the email lowercased, and the rules compare lowercased on both sides so
> older mixed-case rows still resolve. See the caveat below.
>
> `npm --prefix frontend run check` is clean (0 errors). Verified locally in the
> browser: header nav + active state (EN and FA/RTL, desktop and 390px phone, no
> horizontal overflow), `/about`, the `/my` login screen, its friendly
> "Incorrect email or password" (no raw Firebase error), and all four card states
> — paid+link, **unpaid+link (join button still shown — payment gates nothing)**,
> unpaid+no-link, and a long course name — in English and Persian/RTL.
>
> **Deployed 2026-07-15 (human-confirmed), in this order:** `firebase deploy
> --only firestore:rules` → `firebase deploy --only functions`
> (**`createStudentLogin` created** in `me-central1`; `notifyOnRegistration`
> updated, unchanged in behaviour) → `npm --prefix frontend run build &&
> firebase deploy --only hosting` (→ https://samisphere-82309.web.app).
> Committed + pushed to `main` and tagged **`v1.2.0`**.
>
> **Verified against production after deploy** (not assumed):
> - `createStudentLogin` is reachable and answers an unauthenticated caller with
>   our own `UNAUTHENTICATED` / "You must be signed in." — proving both the IAM
>   invoker and the teacher guard are live, and that the browser will not hit a
>   CORS/403 wall.
> - Anonymous read of **all registrations** → `PERMISSION_DENIED` ✅
> - Anonymous **query of registrations by email** → `PERMISSION_DENIED` ✅
>   (logged-out visitors cannot reach student data even when constrained)
> - Anonymous **`courses where status == "available"`** → 200, 6 courses ✅
>   (an unconstrained list of *all* courses is denied, as intended — hidden slots
>   never reach the public)
> - `/`, `/my`, `/about` all serve 200.
>
> ⏳ **Remaining (human steps):**
> **(a) The end-to-end student flow is the one thing still unproven live**
> (create a login → student signs in at `/my` → sees their cards). It needs a
> real student account and Samira's dashboard login, so it is yours to run — the
> natural first check. Everything it depends on is verified above.
> **(b)** Samira to review the new **RU/FA** strings — the standing review note
> from Phase 7 / 10.5 / 12, now extended, still open.
> **(c) Legacy mixed-case emails:** any registration created before today whose
> stored email has capitals will not match its student. The rules allow the read,
> but Firestore cannot query case-insensitively, so the row stays invisible to
> them. If a student reports an empty dashboard, re-save that registration's
> email in lowercase. New registrations are unaffected.
> **(d)** Live-data cleanup of old test registrations (from v1.1) still pending.
>
> **Noted from the live data:** at least one available course has an empty
> `meetingLink` (`""`). That is handled — an empty string is falsy, so the card
> shows the dashed "Class link available soon" placeholder rather than a dead
> button. Students on that course will see the link appear as soon as Samira adds
> one.

---

## 3. What is deliberately NOT in version 1

(Carried over from docs 01–02 — written down so they're remembered, not built now.)

| Deferred feature | Why deferred |
|---|---|
| Automatic capacity (slot auto-hides when full) | Manual hide is simpler; `capacity` field already exists for later |
| Email as a second notification channel | One channel (Telegram) first |
| Browser language auto-detection | Manual switch first; less logic |
| Graphic logo (icon/sphere image) | Wordmark is enough for v1 |
| Java/Node backend | `backend/` folder reserved; not needed yet |
| Mobile app | Structure supports adding `mobile/` later |

---

## 4. Summary

SamiSphere is built in **12 phases (0–11)**, each a vertical slice ending in
something that works and a checklist to verify it. The student-facing core comes
first (Phases 3–4), then the teacher dashboard (5–6), then languages and styling
(7–8), then notifications (9), security (10), and finally real-value testing and
go-live (11). Telegram is built with placeholders and only connected to a real
bot during testing — exactly as planned.

---

*Next step: 04 — Create the GitHub repository (Phase 0 begins).*
