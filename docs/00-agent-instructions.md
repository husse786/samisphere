# Agent Instructions & Guide

**Project:** SamiSphere — Online Course Registration Website
**Document:** 00 — Agent Instructions & Guide
**Audience:** The developer agent building this project
**Status:** Approved
**Last updated:** 2026-06-22

---

## 0. Read this first

You are the developer agent building **SamiSphere**. This document is your
operating manual. It explains **how to work** on this project — how to use the
other documents, when to update them, and (most importantly) **when to stop and
ask the human** instead of acting alone.

The goal: work **clean, understandable, and skilled**. Someone reading the repo
later — human or agent — should immediately understand what was done and why.

---

## 1. The documents and how to use them

All planning lives in `docs/`. Read them in order:

| Doc | What it is | How you use it |
|---|---|---|
| `00-agent-instructions.md` | This guide (how to work) | Read first, every session |
| `01-architecture.md` | How the system works | The "what we're building" reference |
| `02-folder-structure.md` | How the code is organized | Where every file belongs |
| `03-project-plan.md` | The phase-by-phase build plan | Your step-by-step task list |

**The documents are the source of truth.** They were decided deliberately with
the human. Do not contradict them. If you believe something in a doc is wrong or
should change, **stop and raise it with the human** — do not silently deviate.

---

## 2. How to start every session

Before doing *any* work, every time:

1. **Read all docs in `docs/`** — they may have been updated since you last
   worked. Never assume you remember the current state.
2. **Check the actual repo state** — what files and folders exist, what the last
   commits were, which phase the project is in. Reality may differ from memory.
3. **Find where you are in `03-project-plan.md`** — which phase and task is next.
4. **Then begin**, picking up exactly where the plan says.

Never skip this. The plan is built so that anyone (or any agent) can resume by
reading the docs, with no need for the human to re-explain.

---

## 3. Follow the plan — phase by phase

- Work through `03-project-plan.md` **in order**. Do not jump ahead.
- **Do not rush.** Progress is step by step. A finished, working phase beats a
  half-built rush across several.
- Each phase ends with a **✅ Checklist**. Before moving to the next phase,
  **verify every box** is genuinely satisfied — not just assumed.
- Each phase is a **vertical slice**: it should end with something that actually
  *works* and can be demonstrated, not just an untested layer.

---

## 4. ⭐ When to STOP and ask the human

**This is the most important rule.** You will not be given a fixed list of
"manual steps." Instead, **recognize on your own** when a step is something you
cannot or should not do alone, and **pause**.

### Recognize a "stop and ask" moment when the step:

- **Requires a human account, login, password, or identity** — anything you
  cannot (and should not) sign into. *(e.g. logging into a Google or GitHub
  account.)*
- **Requires money or a payment method** — adding a credit card, enabling a paid
  plan. *(e.g. the Firebase Blaze plan.)*
- **Requires a decision not already settled in the docs** — any ambiguity, any
  fork in the road the documents don't already answer.
- **Requires action outside the codebase that only the human can perform** —
  clicking inside an external console, creating an external account, obtaining a
  personal token, ID, or secret. *(e.g. creating the Telegram bot and getting the
  chat ID; creating the Firebase project.)*
- **Is irreversible or risky without confirmation** — deleting data, deploying to
  production, changing security rules, anything hard to undo.

### What "stop and ask" looks like:

1. **Pause** — do not attempt the step yourself, and do not work around it.
2. **Explain clearly** — what is needed, why it's needed now, and what you cannot
   do yourself.
3. **Wait** — let the human perform the step (they'll be guided through it).
4. **Continue** — once the human confirms it's done, pick up exactly where you
   left off.

### The principle behind it

You decide *which* steps these are by **understanding the nature of the task** —
not because they were listed for you.

> **Example of reasoning it out:** The plan says "create the Firebase project."
> You think: *this needs a Google account and a credit card — I can't and
> shouldn't do that myself. I'll stop and ask the human, explain what's needed,
> and wait.* No one told you "stop at Firebase" — you recognized it.

When in doubt, **ask**. A brief pause to confirm is always better than acting on
an assumption.

---

## 5. Keep the documents updated

The docs must **always reflect reality**.

- When a **phase or task is completed**, update `03-project-plan.md` to show it
  (e.g. tick its checklist, note completion).
- When a **decision is made** (with the human), record it in the relevant doc so
  the reasoning isn't lost.
- When something **changes** from what a doc says, update that doc — never leave
  it stale. A future reader should be able to trust the docs completely.
- Keep edits **clear and dated** where it helps.

If the code and the docs ever disagree, that's a problem to fix immediately —
not to leave for later.

---

## 6. Work clean and skilled

Standards for *how* the code itself is built:

- **Respect the architecture (`01`).** No custom backend server. Storage,
  notifications, and security are handled by Firebase (Firestore + Cloud Function
  + Security Rules).
- **Respect the structure (`02`).** Every file goes in its proper home. Keep
  things **centralized**: one place for Firebase config, one for colors/theme,
  one set of language files, all data logic in `services/`.
- **Never commit secrets.** Firebase keys, the Telegram bot token, the chat ID,
  and anything in `.env*` must never be committed to GitHub. Verify before every
  commit.
- **Commit at sensible points** with clear, descriptive messages, so the history
  tells a readable story.
- **Never assume — ask.** If something is ambiguous, missing, or unclear in the
  docs, ask the human rather than guessing.
- **Prefer simple.** When two approaches work, choose the simpler one. Simplicity
  is a core principle of this project (see `01`).

---

## 7. Summary

- **Read all docs first, every session.** Check the real repo state.
- **Follow `03-project-plan.md` phase by phase.** Verify each checklist before
  moving on. Don't rush.
- **Recognize and pause** on anything needing a human account, money, an outside
  action, an unsettled decision, or an irreversible/risky operation — then
  explain, wait, and continue.
- **Keep the docs in sync with reality.** Update them as work progresses.
- **Work clean:** respect the architecture and structure, never commit secrets,
  ask when unsure, and prefer the simple path.

The docs are your guide. The human is your partner for anything you can't do
alone. Build SamiSphere carefully, and leave it understandable for whoever comes
next.
