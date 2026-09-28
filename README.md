# AlgoMentor

AlgoMentor is a full-stack DSA learning platform that helps users build algorithmic intuition while practicing in a real coding environment. The app combines AI-powered tutoring, structured curriculum progression, live collaborative rooms, and code execution tooling into a single web app served on port 3000.

It is built with React 19 + Vite on the frontend, Express + WebSockets on the backend, Firebase for auth and persistence, and Google Gemini for AI coaching and interview simulation.

## Overview

AlgoMentor is designed for people who want to learn Data Structures and Algorithms in a way that feels like a guided training environment rather than a static tutorial page. A user can:

- work through a structured 5-day coding journey
- ask an AI tutor for hints, explanations, and code review
- practice DSA problems in a multi-language coding arena
- join live study rooms and collaborate in real time
- track achievements, mastery, and coding archetype
- take a diagnostic assessment and receive a personalized roadmap

## Core stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, Monaco Editor |
| Backend | Express, Node.js, WebSockets (`ws`) |
| AI | Google Gemini via `@google/genai` |
| Authentication & sync | Firebase Auth + Firestore |
| Execution | Node VM sandbox for JavaScript; Gemini-backed simulation for Python/C++/Java |
| Real-time collaboration | WebSocket room broadcasting + in-memory room state |

## Architecture at a glance

```text
Browser
  └─ React SPA (Vite frontend on port 3000)
       ├─ Firebase auth / profile sync
       ├─ Monaco editor for practice
       ├─ dashboard, roadmap, achievements, chat, tracks, interview, collab etc.
       └─ REST calls to /api/*

Express server (same port 3000)
  ├─ /api/health
  ├─ /api/tutor/chat
  ├─ /api/tutor/hint
  ├─ /api/tutor/explain-code
  ├─ /api/tutor/evaluate-solution
  ├─ /api/tutor/interview
  ├─ /api/sandbox/run
  ├─ /api/collab/rooms
  └─ WebSocket server at /ws

AI + runtime services
  ├─ Gemini tutor and interviewer
  ├─ progressive hint generation
  ├─ DSA evaluation and explanation
  ├─ JavaScript VM sandbox
  └─ simulated execution for Python / C++ / Java
```

## App experience

The app uses a tab-based navigation model with the following primary screens:

- Dashboard
- 5-Day Journey
- Achievements
- AI DSA Tutor
- Learning Tracks
- Practice Arena
- Study Rooms
- DSA Interview
- Code Explainer
- DSA Roadmap
- Video Vault

A user is routed to an auth gate until logged in. After authentication, the app loads the user profile, progress, streak, and learning state from Firebase and local persisted state.

## Features

### 1. Personalized learning path

The app includes a structured onboarding and progression system:

- 5-day coding journey with day-by-day objectives
- coder archetype calibration (beginner, intermediate, extraordinary)
- skill metrics such as algorithmic thinking, Big-O optimization, data structures, etc.
- badge tracking and achievement unlocks
- active track selection and topic completion tracking

### 2. AI DSA tutor

The backend exposes an AI tutor that is tuned specifically to DSA and coding interview prep.

Supported behavior:

- general DSA Q&A
- progressive hint ladder (5 levels)
- code explanation breakdowns
- solution evaluation and Big-O assessment
- mock interview turn generation
- final interview scorecards

The tutor has a guiding system instruction that attempts to redirect non-DSA requests with a playful “savage senior dev” persona while staying within the domain.

### 3. Practice arena

The practice experience is built around Monaco Editor and a sandboxed execution layer.

Capabilities:

- JavaScript, Python, C++, and Java code entry
- syntax highlighting and editor tooling
- automated execution against test cases when provided
- console output capture and runtime error reporting
- language-specific execution behavior

Important note:

- JavaScript runs in a restricted VM sandbox
- Python, C++, and Java are simulated by Gemini rather than compiled directly in the backend

### 4. Collaborative study rooms

The app includes in-memory collaborative rooms with:

- room creation from a name and problem context
- live room list API
- WebSocket broadcasts for room state and chat
- shared code sessions
- user presence and message tracking

Rooms are intentionally in-memory and reset on server restart. The app seeds a few demo rooms for immediate testing.

### 5. Interview mode

Users can simulate interview scenarios with problem difficulty, transcript history, and evaluation scoring. The backend returns a structured scorecard covering:

- overall score
- problem-solving score
- communication score
- complexity score
- optimization score
- summary and improvements

### 6. Roadmap + resources + learning tracks

The app includes curriculum content curated around DSA topics and learning resources. Data is stored in TS data modules rather than a database, which keeps content static and local to the app.

Examples include:

- Big-O analysis
- arrays and strings
- two pointers
- binary search
- graph traversal
- dynamic programming
- roadmap progression
- video vault recommendations

## Folder structure

```text
AlgoMentor/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── achievements/
│   │   ├── assessment/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── code-explainer/
│   │   ├── collab/
│   │   ├── dashboard/
│   │   ├── interview/
│   │   ├── journey/
│   │   ├── layout/
│   │   ├── practice/
│   │   ├── resources/
│   │   ├── roadmap/
│   │   └── tracks/
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── AuthContext.tsx
│   ├── data/
│   │   ├── achievementBadgesData.ts
│   │   ├── dsaTopics.ts
│   │   ├── fiveDayJourneyData.ts
│   │   ├── practiceProblems.ts
│   │   └── ...
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── firestoreErrors.ts
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── firebase-applet-config.json
├── firestore.rules
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
├── .env
├── .gitignore
├── README.md
└── ...
```

## Local setup

### Prerequisites

- Node.js 18+ recommended
- npm
- Gemini API key
- Firebase project config available in `firebase-applet-config.json`

### Install dependencies

```bash
npm install
```

### Configure environment

Create a `.env` file in the project root with:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The app also expects `firebase-applet-config.json` to exist and be valid for Firebase initialization.

### Run the app in development

```bash
npm run dev
```

This starts the Express app with Vite middleware and serves the frontend and API on the same port:

- frontend: http://localhost:3000
- API: http://localhost:3000/api
- websocket: ws://localhost:3000/ws

### Build for production

```bash
npm run build
```

This command runs:

1. `vite build` for frontend asset generation
2. `esbuild server.ts --bundle ...` for backend bundling into `dist/server.cjs`

### Start production build

```bash
npm start
```

This runs the compiled server from `dist/server.cjs`.

## Available scripts

From `package.json`:

```json
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist server.js",
    "lint": "tsc --noEmit"
  }
}
```

## Backend API endpoints

All endpoints are served from the same app and are reachable under `/api`.

### Health

```http
GET /api/health
```

Returns service status for the backend.

### Tutor endpoints

```http
POST /api/tutor/chat
POST /api/tutor/hint
POST /api/tutor/explain-code
POST /api/tutor/evaluate-solution
POST /api/tutor/interview
```

These endpoints call Gemini with DSA-focused prompts and return AI responses appropriate to the user’s level and selected tone.

### Code execution

```http
POST /api/sandbox/run
```

Purpose:

- execute JavaScript in a restricted VM sandbox
- capture console output and errors
- simulate runtime evaluation for non-JS languages via Gemini reasoning
- return execution time and optional test results

### Collaboration endpoints

```http
GET /api/collab/rooms
POST /api/collab/rooms
```

These manage study-room discovery and room creation. Room state is stored in memory and is meant for demo/interactive usage rather than persistent production storage.

### WebSocket

```text
ws://localhost:3000/ws
```

The server uses a WebSocket endpoint for real-time collaborative editing and chat. Messages are broadcast to room members, and code updates are shared live.

## AI model behavior

The backend uses a fallback model chain:

- `gemini-3.7-flash`
- `gemini-3.6-flash`

It automatically retries transient errors such as 503/429 and falls back to the next model in the chain when needed. The request headers include a custom User-Agent value: `aistudio-build`.

## Firebase configuration

Firebase is initialized from `firebase-applet-config.json` in the root. This configuration includes:

- API key
- auth domain
- project ID
- storage bucket
- messaging sender ID
- app ID
- optional Firestore database ID

The app initializes a singleton app and creates:

- Firebase Auth instance
- Firestore instance
- Google auth provider

User documents are synced to Firestore with profile details such as:

- skill level
- archetype
- five-day journey state
- earned badges
- completed topics
- solved problems
- preferred language
- active track
- streak

## Data model and content approach

Most learning content is stored in static TypeScript data modules under `src/data/` rather than fetched from an external database. This includes:

- DSA topic catalog
- practice problem collections
- five-day journey curriculum
- achievement badge data
- assessment questions

The app is therefore content-driven and can be extended by editing the relevant data modules.

## Important project notes

- This project currently has no automated test framework configured.
- `npm run lint` runs TypeScript type checking only (`tsc --noEmit`).
- The backend and frontend share the same port (3000), so they are served together in a single process.
- `vite build` must happen before backend bundling in `npm run build` because the backend expects the produced frontend assets in `dist/`.
- In-memory collab rooms are intentionally ephemeral and lose state on restart.
- Non-JS execution is simulated via Gemini rather than running a real compiler or interpreter in the backend.

## Troubleshooting

### Missing Gemini key

If the app cannot generate AI responses:

- confirm `.env` exists
- confirm `GEMINI_API_KEY` is set
- restart the dev server after updating the environment

### Firebase auth issues

- ensure `firebase-applet-config.json` is present and valid
- verify the Firebase project configuration matches the app’s expected project
- check browser console logs for Firestore/Auth initialization errors

### Build issues

- run `npm install` if dependencies are missing
- ensure Node version is compatible with the project
- re-run `npm run build` after checking that Vite output is generated successfully

## Current status

This project is a functioning React + Express DSA learning app with an AI tutor, live collaboration, structured learning journeys, and problem practice tooling. The README has been updated to reflect the current implementation and the actual backend routes rather than older, stale API documentation.

## License

No explicit license file is included in the repository at this time. If you plan to distribute or publish the project, add an appropriate license before doing so.
