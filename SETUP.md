# Run Digital Dhaal on your own computer

Follow these steps exactly — takes about 10 minutes the first time.

## 1. Install the tools (one time only)

- **Node.js 22 or newer** — download the LTS installer from [nodejs.org](https://nodejs.org) and install with default options.
- **Git** — download from [git-scm.com](https://git-scm.com) and install with default options.

Close and reopen your terminal (PowerShell) after installing.

## 2. Get the code

```
git clone https://github.com/sajid3134/digital-dhaal.git
cd digital-dhaal
npm install
```

## 3. Create your settings file

Copy the example settings file:

```
copy .env.example .env
```

Open the new `.env` file in Notepad and fill in:

| Setting | What to put |
|---|---|
| `GEMINI_API_KEY` | Your own free key — get it in 1 minute at [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (sign in with Google → Create API key) |
| `ADMIN_PASSWORD` | Any password you like — this opens the engineer portal on your machine |

Everything else can stay empty — Google login and bKash are optional extras.

## 4. Run it

```
npm run dev
```

Then open **http://localhost:3000** in your browser.

- The engineer portal is at **http://localhost:3000/admin** (username: anything, password: your `ADMIN_PASSWORD`).
- Phone verification is in demo mode — the 6-digit code prints **in your terminal** instead of a real SMS.
- Your local database lives in the `data/` folder on your machine only — everyone's test cases are separate.

## 5. Getting updates later

When someone pushes new code, pull it before running:

```
git pull
npm install
npm run dev
```

## 6. Uploading your own work

Easiest way — on the GitHub website: open **your own named folder** → `Add file` → `Upload files` → commit. Please only touch your own folder; the app code changes go through Sajid.

## If something breaks

- `'node' is not recognized` → reinstall Node.js, then reopen the terminal.
- Chat replies with a connection error → check your `GEMINI_API_KEY` is filled in correctly.
- Port 3000 already in use → close other terminals running the app, or restart your PC.
- Anything else → message Sajid with a screenshot of the terminal.
