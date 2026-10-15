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
- `POST /api/progress/:levelId` persists completion, XP, hints and bug-fix data.
- `POST /api/attempts` records quiz or coding attempts.
- `POST /api/activity` records learning activity.
- `DELETE /api/me/progress` clears the authenticated learner's progress.

`npm run dev` or `npm run dev:full` starts both processes. `npm run server` starts only the API on `http://localhost:8787`, and `npm run dev:client` starts only Vite. The Vite dev server proxies `/api` to the API. Runtime data is stored in `data/pico.sqlite` and is intentionally git-ignored.

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

## Not built yet (good next steps)

Diagnostic assessment, adaptive difficulty, daily challenge + history, escape rooms,
leaderboards, company simulation, career paths, interview arena, skill passport,
certificates, Git/GitHub lessons, a backend (login, database, leaderboards), and swapping
the textarea for Monaco editor (`@monaco-editor/react`).
