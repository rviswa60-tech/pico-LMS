# Pico Labs – Interactive Python LMS 

A working vertical slice of the product vision: roadmap with locked levels, animated Pico,
in-browser Python (real Python via Pyodide), quiz with "Why did I get this wrong?", challenges
with 4 progressive hints + solution, struggle detection, boss battles, XP / ranks / streaks /
badges, reward screen with confetti, and level unlocking. Progress is saved in localStorage.

## Run in VS Code

1. Install Node.js 18+ (https://nodejs.org)
2. Open this folder in VS Code (File > Open Folder)
3. Open the terminal (Ctrl + `) and run:

       npm install
       npm run dev

4. Open the URL it prints (usually http://localhost:5173). The default command starts both the Vite frontend and the API server.

The first code run downloads the Python runtime (~10 MB) from a CDN, so you need internet.

## Full-stack development

The app includes a small production-shaped API in `server/` using Node's built-in HTTP, crypto and SQLite modules. No native database dependency is required.

- `GET /api/health` checks the service.
- `POST /api/auth/guest` creates a local learner session and bearer token.
- `GET /api/me` returns the authenticated learner and dashboard summary.
- `GET /api/dashboard` returns progress, attempts, activity and streak data.
- `GET /api/levels` returns the seeded 20-level course catalog.
- `GET /api/assessments/:gateAfter` returns a competency test without answer keys.
- `POST /api/assessments/:gateAfter/submit` grades objective answers and records the attempt.
- `POST /api/progress/:levelId` persists completion, XP, hints and bug-fix data.
- `POST /api/attempts` records quiz or coding attempts.
- `POST /api/activity` records learning activity.
- `DELETE /api/me/progress` clears the authenticated learner's progress.

`npm run dev` or `npm run dev:full` starts both processes. `npm run server` starts only the API on `http://localhost:8787`, and `npm run dev:client` starts only Vite. The Vite dev server proxies `/api` to the API. Runtime data is stored in `data/pico.sqlite` and is intentionally git-ignored.

## Authentication

The app now includes account registration, cookie-backed sessions, CSRF protection, login/logout, protected learning access, password hashing with Node's `scrypt`, and one-time expiring password reset tokens. Existing guest-era database records are preserved by additive migrations.

For production, set a strong secret before starting the API:

```powershell
$env:PICO_AUTH_SECRET = "replace-with-a-long-random-secret"
$env:NODE_ENV = "production"
npm start
```

Password reset requests intentionally use a generic response so they do not reveal whether an email exists. In local development, the reset response exposes a temporary reset token in the UI so the flow can be tested without an email provider. Production email delivery is the remaining external integration: connect `/api/auth/request-reset` to your transactional email provider and never return `devResetToken` in production.

## Competency assessments and execution boundary

The existing 20-level curriculum is preserved. Competency gates are created after Levels 3, 6, 9, 12, 15 and 18. After the first three levels, the student receives a five-question coding assessment. Questions are ordered from Foundation through Stretch and displayed one at a time with a problem statement, starter code and sample output. Copy, cut, paste and context-menu actions are disabled inside the assessment. A failed attempt is stored and does not unlock the next level.

Unlocking also requires a trusted coding result. The current browser Pyodide runner is useful for practice, but it is not treated as a secure grader. Set `PICO_EXECUTOR_TRUSTED=1` only when a separately isolated execution service has verified the required coding submissions and the service-to-API exchange has been implemented. Do not enable this flag as a substitute for sandboxing in production.

## Project map

    src/data/levels.js          ALL course content (add levels here)
    src/store.js                XP, ranks, streaks, badges, unlock state (localStorage)
    src/python.js               Pyodide loader + code runner + error parsing
    src/components/Pico.jsx     Animated bear (12 moods) + global companion/speech bubble
    src/components/Roadmap.jsx  Winding path, locks, unlock animation
    src/components/LevelView.jsx Learn > Quiz > Challenge > Boss flow
    src/components/Challenge.jsx Checking, hints, struggle detection
    src/components/Playground.jsx Code editor + Run + output
    src/components/Quiz.jsx     MCQ with explanations
    src/components/Reward.jsx   XP count-up, badges, confetti, unlock

## Add a new level

In `src/data/levels.js`, add an object to the `CONTENT` array (index 3 = Level 4, Loops).
Copy the shape of an existing level: `learn`, `quiz`, `challenge`, `boss`, `bossBadge`.
A challenge passes when: stdout equals `expected`, optional `assertions` (Python) pass,
and every regex in `rules` matches the learner's source.

## Remaining production work

The isolated Python execution service is intentionally not bundled into this small local
repository. Configure a Judge0-style or hardened worker service before enabling trusted
coding assessment results. The current editor remains a lightweight accessible textarea;
Monaco can be added later if the bundle size trade-off is acceptable.
