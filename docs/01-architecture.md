# Architecture & Workflow

**Project:** SamiSphere — Online Course Registration Website
**Brand / website name:** SamiSphere
**Built for:** Samira (the teacher)
**Document:** 01 — Architecture & Workflow
**Status:** Approved
**Last updated:** 2026-07-15

---

## 1. Purpose

**SamiSphere** is a website that lets students register themselves for courses
that the teacher (Samira) defines and controls. The teacher is notified on
Telegram each time someone registers, and can manage which courses and time
slots are visible to students.

The brand and website name is **SamiSphere**, shown as a styled text wordmark
(no logo image needed for version 1) in the site header, next to the language
switcher.

**Guiding principles:**

- Keep everything as simple as possible.
- Security first, but no custom backend server to maintain.
- The teacher is in control of what students can see.

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | **Svelte** | Simple, lightweight |
| Hosting | **Firebase Hosting** | Free at this scale, all-in-one |
| Database | **Firebase Firestore** | No server to manage, free tier |
| Notifications | **Firebase Cloud Function → Telegram** | Runs only when triggered |
| Source control | **GitHub** | Version control + collaboration |
| Multilanguage | **svelte-i18n** (English, Russian, Persian) | Handles translation + RTL |

> **Note on cost:** Firebase Cloud Functions require the Blaze (pay-as-you-go)
> plan. At this project's scale, usage stays inside the free monthly allowance,
> so the expected cost is **€0**. A credit card is required on the account.

---

## 3. The Core Pieces

The system is built from the public website, two dashboards, and Firebase
behind them.

### The header — a permanent four-item shell (Phase 13)

Every page carries the same header: the SamiSphere wordmark, four navigation
links, and the language switcher.

```
SamiSphere    Homepage · About · Teacher dashboard · Student dashboard    🇬🇧 🇷🇺 🇮🇷
```

These four doors are meant to stay **stable for a long time**. Future features
(homework, AI agents, …) go *inside* one of the dashboards — they do **not**
become a fifth header item. `/about` is a placeholder until Samira writes it.

### A. Public Website (what students use)

- A welcoming **landing page** (`/`) with the SamiSphere wordmark, a short
  intro, and a call-to-action button to the registration form. *(Added in
  Phase 10.5.)* It also shows a **course showcase** — each available course
  once, as name + price only (no times, links, or capacity), with a "Courses
  coming soon" placeholder when none are priced. *(Added in Phase 12.)*
- The **registration form** lives on its own page (`/register`).
- Prominent, highly visible language switcher (🇬🇧 English / 🇷🇺 Russian / 🇮🇷 Persian).
- Persian renders **right-to-left (RTL)**; English and Russian render left-to-right.
- A registration form where the student selects a course + time slot from a
  dropdown. **Only currently available slots are shown.**
- The student does **not** type a course freely — they select from the
  teacher's predefined list.

### B. Teacher Dashboard (password-protected)

- Add and edit courses and their time slots.
- Toggle each course or time slot **on/off** (show/hide).
- View all student registrations.
- Protected by login — only the teacher can access it.

### C. Student Dashboard (`/my`, password-protected) — Phase 13

The third core piece: where a confirmed student sees what they signed up for.

- **Login is the confirmation.** There is no separate "confirm" step and no
  self-serve sign-up: Samira clicks **Create login** on a registration, and a
  Cloud Function creates that student's Firebase Auth account and returns a
  one-time password. She sends it over Telegram herself.
- **One login per student (by email); all their courses on one page.** A student
  registers per course, so one email may have several registrations — each shows
  as its own card.
- Each card shows the course + time, a **Paid / Not paid** badge, a large
  **Join class** button (the course's `meetingLink`), and below it the paid date
  or the course price.
- **Payment gates nothing.** The join button always appears when the course has a
  `meetingLink`, paid or not. Payment is a status Samira tracks, never leverage
  over a student. A course with no link shows a dashed "available soon"
  placeholder instead — never a dead button.
- **Passwords are never stored in Firestore** — only in Firebase Auth (hashed).
  Samira cannot view an existing password, only reset it.

### D. Backend Services (Firebase, no server to run)

- **Firestore** stores courses/slots and registrations.
- **Cloud Function** (`notifyOnRegistration`) fires automatically on each new
  registration and sends a Telegram message to the teacher.
- **Cloud Function** (`createStudentLogin`, Phase 13) is a **callable** that
  creates or resets a student's auth account. It needs the Admin SDK, which must
  never run in a browser, and it verifies the caller is the teacher before doing
  anything. Both functions run in `me-central1` — the region is pinned in
  `functions/index.js` and mirrored in `config/firebase.js`, which must agree or
  the browser calls a URL that does not exist.
- **Firebase Auth** holds the teacher's account and every student's. Students'
  accounts are created only by `createStudentLogin`; there is no self-serve
  sign-up.

---

## 4. Data Model (Firestore)

### Course / Time Slot

Each slot the teacher creates is stored with a status they can flip.

```
{
  course:      "Math 101",
  time:        "Monday 10:00",
  status:      "available",   // teacher flips to "hidden" to remove from the form
  capacity:    20,            // optional — reserved for future auto-full feature
  meetingLink: "https://meet.google.com/abc-defg-hij",
                              // optional (Phase 10.6) — static online-class URL
                              // the teacher attaches; may be empty/absent
  price:       12.5,          // optional (Phase 12) — a number, decimals allowed
  priceUnit:   "hour",        // optional — "hour" | "month"
  currency:    "USD"          // optional — "RUB" | "USD"
}
```

- When `status` is `"available"` → the slot appears in the student dropdown.
- When `status` is `"hidden"` → the slot is skipped and students never see it.
- **Price is per course** (Phase 12): it is not expected to differ between time
  slots of the same course. All three price fields are optional and absent on
  legacy courses; the homepage showcase simply skips a course with no price.

### Registration

One entry is created each time a student registers. (Expanded in Phase 10.5 to
collect fuller student details — see doc 03.)

```
{
  firstName: "Anna",
  lastName:  "Ivanova",
  email:     "anna@example.com",  // stored LOWERCASE (Phase 13) — this is the
                                  // key the student dashboard matches against
                                  // the student's Firebase Auth email
  phone:     "+994 50 123 45 67",
  city:      "Baku",
  country:   "Azerbaijan",
  course:    "Math 101",
  time:      "Monday 10:00",
  comment:   "Prefer evenings, thanks!",  // optional (Phase 12) — ≤ 500 chars
  paid:      true,            // optional (Phase 13) — per REGISTRATION, not per
                              // student. ABSENT means NOT PAID (old records).
  paidAt:    "2026-07-15",    // optional (Phase 13) — the day `paid` became true
                              // (YYYY-MM-DD). Removed when flipped back to unpaid.
  date:      "2026-06-22"
}
```

> Note: addresses are limited to **city + country** (no street). Early
> registrations created before Phase 10.5 may instead have a single `name`
> field; the dashboard and notification handle both shapes. The optional
> `comment` (Phase 12) is a short student note (≤ 500 characters), stored only
> when provided and shown in the dashboard + Telegram message when present.
>
> **Payment (Phase 13):** `paid` / `paidAt` are set only by the teacher, from her
> dashboard. Payment is **per registration** — Anna can be paid for one course
> and unpaid for another — and it **gates nothing**: the student's join link does
> not depend on it. An absent `paid` reads as not paid, so nothing had to be
> written to existing records.
>
> **Email casing (Phase 13):** Firebase Auth normalizes addresses to lowercase,
> and the student dashboard finds a student's courses by matching this field to
> their auth email. New registrations are therefore stored lowercased
> (`services/registrations.js`), and the security rules compare lowercased on
> both sides so older mixed-case records still resolve to their owner.

---

## 5. Registration Flow

Example — a student named Anna registers:

1. **Anna opens the website.** She picks her language, sees the course list,
   and selects an available course + time slot from the dropdown.
2. **She clicks "Register."** Her info is saved as one new entry in Firestore.
3. **The save triggers a Cloud Function automatically.** No server runs
   continuously — the function only wakes for the moment it is needed.
4. **The function sends a Telegram message to the teacher:**
   *"New registration: Anna signed up for Math 101 — Monday 10:00."*
5. **(Optional) The teacher opens the dashboard** to view all registrations.

---

## 6. Handling a Full Slot — Manual Hide (Option A)

When a time slot fills up or the teacher no longer wants to offer it:

- The teacher **manually toggles the slot off** from the dashboard.
- The slot's `status` becomes `"hidden"` and it disappears from the student form.

Example:

- Teacher offers "Math 101 — Monday 10:00" and "Math 101 — Wednesday 14:00".
- Monday fills up → teacher hides the Monday slot → students now see only Wednesday.

> **Future option (not built now):** automatic capacity — a slot auto-hides
> once `capacity` is reached. Deferred to keep the first version simple. The
> `capacity` field is already in the data model to support this later.

---

## 7. Security

The main risk is a stranger spamming fake registrations or reading student data.

This is handled by **Firestore Security Rules** (no backend server needed):

- **Anyone** may *create* a registration (so students can sign up).
- **Only the logged-in teacher** may *edit* or *delete* registrations, and read
  **all** of them.
- **A logged-in student** may *read* **only their own** registrations — those
  whose `email` matches their auth email (Phase 13). They cannot read anyone
  else's, cannot list the collection, and cannot see another student's payment
  status. **Students can never write**: a student cannot mark themselves paid.
- **Only the logged-in teacher** may add, edit, or hide courses and slots.
- **Anyone** may *read* the list of available courses — the student dropdown, the
  homepage showcase, and the student dashboard's meeting link + price all rely
  on this. Hidden courses never reach the public.

The teacher is identified by her pinned email (`samira@samisphere.com`) in the
rules **and** in the `createStudentLogin` function — the two must always agree.
Even if a stranger self-creates an auth account, they get only *student*
access; her address cannot be re-registered because it is already taken.

**How a student's access works, end to end:** their account is an ordinary
Firebase Auth account with no special claims. The rules are therefore the only
thing standing between one student and another's data, which is why the rule is
per-document (`resource.data.email == request.auth.token.email`): a query that
could return someone else's row fails as a whole, so only a query constrained to
their own email succeeds.

Rules are verified in the emulator with `@firebase/rules-unit-testing`
(`npm --prefix tests test`) — 39 cases covering student reads, student write
denials, teacher access, and anonymous access.

> **Passwords** live only in Firebase Auth (hashed). No password is ever written
> to Firestore; `createStudentLogin` returns it once in its response and the
> dashboard shows it once. Samira cannot view an existing password — only reset
> it, which issues a new one and invalidates the old.

---

## 8. System Diagram

```
  Student                Svelte website            Firestore
  (fills form)  ───────► (Firebase Hosting) ──────► (saves registration)
                                                          │
                                                          ▼
   Teacher  ◄──────────  Telegram  ◄──────────  Cloud Function
   (notified)            (message)              (notifyOnRegistration)

   Teacher  ◄──────────  Teacher dashboard ( /dashboard, password-protected)
   (manages courses,     - add / edit / delete courses + slots
    views registrations) - toggle each slot on/off
                         - view registrations
                         - toggle each registration Paid / Not paid
                         - "Create login" per registration
                                     │
                                     ▼
                         Cloud Function (createStudentLogin, callable)
                         - verifies the caller is the teacher
                         - creates the student's Auth account, or resets it
                         - returns ONE friendly password (never to Firestore)
                                     │
                     password sent by Samira over Telegram, by hand
                                     │
                                     ▼
   Student  ─────────►  Student dashboard ( /my, password-protected)
   (logs in)            - lists every registration matching their email
                        - per card: course + time, Paid / Not paid badge,
                          big "Join class" button (always, when a link exists),
                          paid date or price
```

---

## 9. Summary

| Feature | Approach (Version 1) | Deferred to Later |
|---|---|---|
| Teacher dashboard | Password-protected page | — |
| Student dashboard | Password-protected `/my` (Phase 13) | Homework, AI agents (inside it) |
| Student accounts | Teacher creates them; password sent via Telegram | Self-serve sign-up, self-serve reset |
| Payment | Teacher-set status per registration; gates nothing | Collection, invoicing, per-month history |
| Course listings | Stored in Firestore, teacher-managed | — |
| Full slot handling | Manual hide toggle | Automatic capacity |
| Notifications | Telegram via Cloud Function | Email (second channel) |
| Language detection | Manual switch, default English | Browser auto-detect |
| Security | Firestore Security Rules | — |

---

*Next step: 02 — Folder structure planning.*
