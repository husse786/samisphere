# Project Plan

**Project:** SamiSphere — Online Course Registration Website
**Brand / website name:** SamiSphere
**Built for:** Samira (the teacher)
**Document:** 03 — Project Plan
**Status:** Approved
**Last updated:** 2026-06-22

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
- [ ] `services/courses.js` can add, edit, and hide courses
- [ ] Teacher can add a course + time slot from the dashboard
- [ ] On/off toggle flips `status` correctly
- [ ] Hidden slots vanish from the student dropdown immediately
- [ ] Re-enabling a slot brings it back
- [ ] Hand-seeded test data cleaned up
- [ ] Committed and pushed

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
- [ ] `svelte-i18n` configured, defaults to English
- [ ] `en.json`, `ru.json`, `fa.json` cover all current text
- [ ] No hard-coded user-facing English remains in components
- [ ] Prominent switcher in the header changes all text on click
- [ ] Persian renders right-to-left; EN/RU render left-to-right
- [ ] Chosen language persists across pages
- [ ] Committed and pushed

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
- [ ] `theme.css` holds all colors/fonts/spacing and is imported app-wide
- [ ] Components use theme tokens, not hard-coded colors
- [ ] SamiSphere wordmark header appears on every page
- [ ] Buttons/forms use the shared component + theme
- [ ] Site is usable on phone and desktop; switcher visible on both
- [ ] Committed and pushed

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
- [ ] Cloud Function scaffold exists and can deploy
- [ ] Function triggers on new registration (confirmed in logs)
- [ ] Telegram message text is written and correct
- [ ] `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` exist as empty placeholders
- [ ] "Fill in real values during testing" step is documented
- [ ] Committed and pushed

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
- [ ] Security rules written per doc 01 §7
- [ ] Rules deployed to Firebase
- [ ] Logged-out user: can register, cannot read registrations, cannot edit courses
- [ ] Logged-in teacher: full access verified
- [ ] Student dropdown still loads available courses under the rules
- [ ] Committed and pushed

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
- [ ] Telegram bot created; Samira's chat ID obtained
- [ ] Real token + chat ID filled in (stored safely, not on GitHub)
- [ ] Live registration triggers a real Telegram message to Samira
- [ ] Site deployed to Firebase Hosting and loads correctly
- [ ] Full walkthrough passes in EN, RU, and FA (RTL verified)
- [ ] Samira successfully uses it end-to-end herself
- [ ] Final commit pushed; tagged as version 1

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
