<div align="center">

# 🛡 Digital Dhaal — ডিজিটাল ঢাল

**Bangla-first cyber incident response for Bangladesh**

*Hacked account, image blackmail, or a fake profile — speak up without shame or fear.*

[Features](#features) · [How it works](#how-it-works) · [Tech stack](#tech-stack) · [Run locally](#run-it-locally) · [Team](#team)

</div>

---

## The problem

Every day, people in Bangladesh lose Facebook and Gmail accounts to hackers, get blackmailed with private photos, or find fake profiles scamming their friends in their name. Most victims — especially women and young people — don't know where to go, feel too ashamed to ask, and get exploited a second time by "recovery agents" who demand passwords and money up front.

**Digital Dhaal (ডিজিটাল ঢাল — "digital shield")** is a confidential, Bangla-first front door for these victims: a calm intake chat that gathers their case safely, and a human engineer workflow that resolves it.

## Features

### Victim side
- **Bangla-first intake chat** — an LLM-guided assistant collects the case step by step in Bangla, Banglish, or English (it mirrors the user's language), one gentle question at a time
- **Hard safety rules** — the assistant *never* asks for passwords, OTPs, PINs, or images; minors are immediately routed to child-protection channels (helpline 1098)
- **Accounts & verification** — email/password or one-tap Google sign-in, followed by phone number (OTP) verification to deter fake reports
- **Case history** — every case saved per user, with a sidebar to revisit old cases or start a new problem
- **Live progress tracker** — a timestamped timeline (submitted → verifying → contacted → in progress → resolved) so victims always know where their case stands
- **Bilingual UI** — full বাংলা/English toggle across the whole site
- **Installable PWA** — works as an app from the home screen on Android/iOS, no app store needed
- **Feedback & support** — 5-star rating + review after each case, with optional "treat the team" tiers

### Engineer side (`/admin`)
- **Severity-sorted case queue** — critical cases first, with reporter identity and phone-verification badges
- **Full case files** — auto-generated bilingual case card (summary, urgency, recommended first action, support path), complete conversation transcript, and a timestamped event timeline
- **Workflow management** — status transitions (new → verifying → contacted → in progress → resolved → closed) with private engineer notes
- **Dashboard stats** — open/critical/resolved counts and average user rating, plus all feedback

### Under the hood
- Retry-with-backoff and forced-JSON model output for reliable intake turns
- The victim-facing API only ever exposes the assistant's reply — internal case data (flags, recommended actions) never reaches the client
- scrypt password hashing, hashed session tokens, same-origin checks on all mutating routes, per-route rate limiting, OTP attempt/expiry limits, security headers, and a Basic-Auth-gated admin area

## How it works

```
Victim                    System                        Engineer
  │                          │                             │
  │  1. Sign up + verify     │                             │
  │─────────────────────────▶│                             │
  │  2. Tell the story       │                             │
  │     in chat (Bangla)     │                             │
  │─────────────────────────▶│  LLM classifies the case    │
  │                          │  (account takeover /        │
  │                          │   intimate image /          │
  │                          │   impersonation),           │
  │                          │  fills the case card        │
  │                          │────────────────────────────▶│
  │                          │                             │  3. Reviews queue,
  │                          │                             │     verifies identity
  │  4. Sees progress        │◀────────────────────────────│     on video call,
  │     timeline update      │   status + timestamps       │     resolves the case
  │◀─────────────────────────│                             │
```

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4, custom design system, hand-drawn SVG icon set |
| Intake agent | Google Gemini API (single-file provider config — swappable backend) |
| Database | SQLite via Node's built-in `node:sqlite` (zero native dependencies) |
| Auth | Email/password (scrypt) + Google OAuth 2.0 + phone OTP |
| Mobile | Progressive Web App (installable, offline shell) |

## Run it locally

**Requirements:** Node.js 22.5+ (for the built-in SQLite module)

```bash
git clone https://github.com/sajid3134/digital-dhaal.git
cd digital-dhaal
npm install
cp .env.example .env   # then fill in the values below
npm run dev            # open http://localhost:3000
```

`.env` values:

| Variable | What it is |
|---|---|
| `GEMINI_API_KEY` | Free key from [Google AI Studio](https://aistudio.google.com/apikey) |
| `ADMIN_PASSWORD` | Password for the `/admin` engineer portal |
| `APP_URL` | `http://localhost:3000` for local use |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | *(optional)* enables Google sign-in — OAuth "Web application" client from Google Cloud Console with redirect URI `<APP_URL>/api/auth/google/callback` |

> **Note:** phone OTP currently runs in demo mode — the code prints to the server terminal instead of sending a real SMS. Swapping in an SMS gateway is a single function.

There is also a terminal-only test client for the intake agent: `npm run cli`

## Project documents

The concept notes, proposal decks, technical design report, and architecture diagrams live in the repository root. Team members' work-in-progress contributions live under their named folders.

## Team

| Name | GitHub |
|---|---|
| Khondokar Sajid | [@sajid3134](https://github.com/sajid3134) |
| Moushumi Akter Mow | [@mow2021](https://github.com/mow2021) |
| Mohammad Arifain Baher Nayem | [@Arifin200](https://github.com/Arifin200) |
| Ananna Islam | [@anannaislam-prog](https://github.com/anannaislam-prog) |

## Important disclaimers

- Digital Dhaal is **not a substitute for emergency services**. In life-threatening situations, call **999** first.
- Legal information shown in the app is general guidance, not legal advice.
- We never ask users for passwords, OTPs, PINs, or intimate images — anyone doing so in our name is a scammer.
