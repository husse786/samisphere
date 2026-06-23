# Architecture & Workflow

**Project:** SamiSphere — Online Course Registration Website
**Brand / website name:** SamiSphere
**Built for:** Samira (the teacher)
**Document:** 01 — Architecture & Workflow
**Status:** Approved
**Last updated:** 2026-06-22

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

## 3. The Three Core Pieces

The whole system is built from three connected parts.

### A. Public Website (what students use)

- A welcoming **landing page** (`/`) with the SamiSphere wordmark, a short
  intro, and a call-to-action button to the registration form. *(Added in
  Phase 10.5.)*
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

### C. Backend Services (Firebase, no server to run)

- **Firestore** stores courses/slots and registrations.
- **Cloud Function** fires automatically on each new registration and sends a
  Telegram message to the teacher.

---

## 4. Data Model (Firestore)

### Course / Time Slot

Each slot the teacher creates is stored with a status they can flip.

```
{
  course:   "Math 101",
  time:     "Monday 10:00",
  status:   "available",   // teacher flips to "hidden" to remove from the form
  capacity: 20             // optional — reserved for future auto-full feature
}
```

- When `status` is `"available"` → the slot appears in the student dropdown.
- When `status` is `"hidden"` → the slot is skipped and students never see it.

### Registration

One entry is created each time a student registers. (Expanded in Phase 10.5 to
collect fuller student details — see doc 03.)

```
{
  firstName: "Anna",
  lastName:  "Ivanova",
  email:     "anna@example.com",
  phone:     "+994 50 123 45 67",
  city:      "Baku",
  country:   "Azerbaijan",
  course:    "Math 101",
  time:      "Monday 10:00",
  date:      "2026-06-22"
}
```

> Note: addresses are limited to **city + country** (no street). Early
> registrations created before Phase 10.5 may instead have a single `name`
> field; the dashboard and notification handle both shapes.

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
- **Only the logged-in teacher** may *read*, *edit*, or *delete* registrations.
- **Only the logged-in teacher** may add, edit, or hide courses and slots.
- **Anyone** may *read* the list of available courses (to fill the dropdown).

Detailed rule definitions will be specified in a later step.

---

## 8. System Diagram

```
  Student                Svelte website            Firestore
  (fills form)  ───────► (Firebase Hosting) ──────► (saves registration)
                                                          │
                                                          ▼
   Teacher  ◄──────────  Telegram  ◄──────────  Cloud Function
   (notified)            (message)              (fires automatically)

   Teacher  ◄──────────  Dashboard (password-protected)
   (manages courses,     - add / edit courses + slots
    views registrations) - toggle each slot on/off
                         - view registrations
```

---

## 9. Summary

| Feature | Approach (Version 1) | Deferred to Later |
|---|---|---|
| Teacher dashboard | Password-protected page | — |
| Course listings | Stored in Firestore, teacher-managed | — |
| Full slot handling | Manual hide toggle | Automatic capacity |
| Notifications | Telegram via Cloud Function | Email (second channel) |
| Language detection | Manual switch, default English | Browser auto-detect |
| Security | Firestore Security Rules | — |

---

*Next step: 02 — Folder structure planning.*
