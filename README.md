# SamiSphere

**An online course registration website.**

SamiSphere lets students register themselves for courses, while the teacher
stays fully in control of what's offered — and gets notified the moment someone
signs up.

Built for **Samira**, a teacher who needed a simple, reliable way to manage her
course sign-ups.

---

## What it does

- **Students** pick their language, choose an available course and time slot from
  a dropdown, and register in a few clicks.
- **The teacher** logs into a private dashboard to add courses, open or close
  time slots, and see everyone who has registered.
- **Notifications** arrive on Telegram automatically whenever a new student signs
  up — no need to keep checking the site.
- **Three languages** out of the box: English, Russian, and Persian (with proper
  right-to-left layout for Persian).

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | [SvelteKit](https://kit.svelte.dev/) |
| Hosting | Firebase Hosting |
| Database | Firebase Firestore |
| Notifications | Firebase Cloud Function → Telegram |
| Languages | svelte-i18n (English / Russian / Persian) |

There is **no custom backend server to maintain** — Firebase handles storage,
notifications, and security rules.

---

## Project status

🚧 **In development.** Built step by step, one phase at a time.

The complete plan, architecture, and folder structure live in the
[`docs/`](./docs) folder.

---

## Documentation

All planning and instructions are kept in [`docs/`](./docs):

- **[`00-agent-instructions.md`](./docs/00-agent-instructions.md)** — how the
  project is built and maintained (read this first if you're contributing).
- **[`01-architecture.md`](./docs/01-architecture.md)** — how the system works.
- **[`02-folder-structure.md`](./docs/02-folder-structure.md)** — how the code is
  organized.
- **[`03-project-plan.md`](./docs/03-project-plan.md)** — the phase-by-phase build
  plan.

---

*SamiSphere — simple course registration, with the teacher in control.*
