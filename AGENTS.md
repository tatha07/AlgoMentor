# AlgoMentor — Agent Instructions

## Commands

- `npm install` — install deps
- `npm run dev` — run dev server (`tsx server.ts`, port 3000, Vite HMR)
- `npm run build` — `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`
- `npm start` — run production build (`node dist/server.cjs`)
- `npm run lint` — typecheck only (`tsc --noEmit`). No separate linter or formatter.
- `npm run clean` — remove `dist/` and `server.js`
- `npm test` — run unit and security test suite (`tsx --test tests/**/*.test.ts`)

Test framework uses Node.js native `node:test` runner via `tsx --test`.

## Architecture

Single monolithic repo. Frontend (React 19 + Vite + Tailwind CSS) and backend (Express + WebSocket) share port 3000.

**Entry points:**
- Frontend: `src/main.tsx` → `src/App.tsx` (tab-based SPA with 10 views)
- Backend: `server.ts` (Express + WS + Vite middleware + Gemini text proxy + Gnani speech proxy + sandbox)

**Key boundaries:**
- `src/components/` — 13 view/component directories, one per feature tab
- `src/context/` — `AuthContext.tsx` (Firebase auth), `AppContext.tsx` (tab state, user prefs)
- `src/services/api.ts` — frontend-to-backend API calls for Gemini tutor and Gnani speech endpoints
- `src/data/` — **static JSON data**: `practiceProblems.ts`, `dsaTopics.ts`, `assessmentQuestions.ts`, `demoProfiles.ts`. No database queries for content.
- `src/lib/firebase.ts` — Firebase singleton init from `firebase-applet-config.json`
- `src/types/index.ts` — all shared TS types

**Backend routes (`server.ts`):**
- `POST /api/tutor/chat` — Gemini AI tutor
- `POST /api/tutor/hint` — 5-level progressive hint ladder
- `POST /api/tutor/explain-code` — code breakdown
- `POST /api/tutor/evaluate-solution` — Big-O + correctness review
- `POST /api/tutor/interview` — mock interview (dialogue or scorecard)
- `POST /api/speech/transcribe` — Gnani speech-to-text for tutor microphone dictation
- `POST /api/speech/synthesize` — Gnani text-to-speech for tutor replies
- `POST /api/sandbox/run` — JS via `vm` sandbox; Python/C++/Java via Gemini simulation
- `GET/POST /api/collab/rooms` — in-memory study rooms
- `ws://.../ws` — WebSocket for live code sync and room chat

**Important backend quirks:**
- Collab rooms are **in-memory** (`Map<string, CollabRoom>`). Prepopulated with 2 demo rooms. Lost on restart.
- Non-JS code execution (Python, C++, Java) is **simulated by Gemini**, not compiled.
- Gemini model: `gemini-3.7-flash` with fallback to `gemini-3.6-flash` on 503/429. Auto-retries per model (2 retries, exponential backoff). User-Agent is hardcoded to `aistudio-build`.
- Sandboxed JS execution has a 2500ms timeout and exposes only a whitelist of globals (no `require`, `fetch`, `process`, etc.).
- **README is stale on API routes** — it lists `/api/ai/*` endpoints; the real routes are `/api/tutor/*`. Trust `server.ts` over `README.md`.

## Environment

- **Required for text AI**: `GEMINI_API_KEY` in `.env`
- **Required for tutor speech**: `GNANI_API_KEY` in `.env`
- Firebase config is committed in `firebase-applet-config.json` (not env-based)
- `.env` is gitignored. Configure the API keys required for the features you use.

## Conventions

- Path alias `@/*` resolves to project root (see `tsconfig.json` and `vite.config.ts`)
- `"type": "module"` in `package.json` — all source is ESM
- `tsconfig.json` has `noEmit: true` — compilation is handled by Vite (frontend) and esbuild (backend build)
- Dev server uses `tsx` (not `tsc`) for direct TS execution
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (not PostCSS)
- Monaco Editor (`@monaco-editor/react`) for the code editor in PracticeArena

## Gotchas

- **No tests** — verification is manual or via `npm run lint` (typecheck only)
- **Build order matters** — `vite build` must run before `esbuild` (Vite produces `dist/` assets that esbuild's server references)
- **`DISABLE_HMR=true`** — set in `vite.config.ts` to disable HMR/file watching (used by AI Studio agents to prevent flickering)
- **Firebase DB ID** — uses a non-default database ID from config; don't assume `(default)`
- **Data files are TS modules exporting constants** — not imported as JSON. Edit `src/data/*.ts` directly for content changes.
