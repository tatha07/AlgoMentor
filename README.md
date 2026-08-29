# AlgoMentor — AI DSA Instructor & Real-Time Collaborative Coding Platform

AlgoMentor is an interactive Data Structures & Algorithms (DSA) training platform and collaborative coding environment powered by Google Gemini AI, Firebase Authentication & Firestore, and Monaco Editor.

---

## 🏛️ System Architecture

The application is architected as a cohesive full-stack application running on port `3000`:

```
┌─────────────────────────────────────────────────────────────┐
│                       Client (Frontend)                     │
│  - React 18 + Vite + Tailwind CSS                           │
│  - Monaco Editor (@monaco-editor/react) with Test Runner    │
│  - Firebase Authentication (Email/Password & Google OAuth)  │
│  - Firestore Client Sync (User Progress & Profile)          │
│  - WebSocket Client (Real-Time Study Rooms & Live Code Sync)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server (Backend)                 │
│  - Express REST API (/api/*)                                │
│  - WebSocket Server (/ws) for peer study rooms              │
│  - Node.js VM Sandboxed Execution Engine (/api/sandbox/run) │
│  - Google Gemini API Proxy (@google/genai)                  │
│  - Vite Middleware (Dev) & Static Assets (Production)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Access the Frontend and Backend

### 1. Unified Port Access
Both frontend and backend are unified under port **3000**:

- **Frontend Web Application (UI)**:
  - URL: `http://localhost:3000`
  - In Cloud Run preview: The root URL served in your browser.

- **Backend REST API**:
  - Base URL: `http://localhost:3000/api`
  - Endpoints:
    - `GET /api/health` — Backend health check.
    - `POST /api/ai/chat` — Gemini AI DSA Tutor with customizable tone (Senior SDE, Socratic, ELI5, Savage).
    - `POST /api/ai/explain` — Visual & line-by-line algorithm code breakdown.
    - `POST /api/ai/hint` — Progressive 5-level hint ladder generator.
    - `POST /api/ai/evaluate` — Solution correctness & Big-O analyzer.
    - `POST /api/ai/interview` — Live technical interview conversational turn.
    - `POST /api/ai/interview/scorecard` — 4-pillar interview evaluation report.
    - `POST /api/sandbox/run` — Sandboxed code execution engine with automated test case evaluation.
    - `GET /api/collab/rooms` — List of active real-time study rooms.
    - `POST /api/collab/rooms` — Create a new collaborative room.

- **Backend WebSocket Server (Real-Time Collab)**:
  - URL: `ws://localhost:3000/ws` (or `wss://.../ws` in HTTPS/Cloud Run).
  - Handles room broadcast, peer presence, live code synchronizations, and group chat.

---

## 🛠️ Development & Production Commands

### Install Dependencies
```bash
npm install
```

### Run in Development Mode
Starts the Express server with Vite middleware and WebSocket support on `http://localhost:3000`:
```bash
npm run dev
```

### Build for Production
Compiles the Vite frontend to `dist/` and bundles `server.ts` into a self-contained CommonJS binary at `dist/server.cjs`:
```bash
npm run build
```

### Start in Production Mode
Runs the compiled server:
```bash
npm start
```

---

## 🔑 Environment Configuration

Add the following environment variables in `.env` (or configure via the environment settings):

```env
# Google Gemini API Key for AI tutoring, code analysis, and interview simulations
GEMINI_API_KEY=your_gemini_api_key_here
```

Firebase credentials are automatically managed via `firebase-applet-config.json` and Firestore security rules in `firestore.rules`.

---

## 🌟 Key Features

1. **User Authentication & Cloud Sync (Firebase)**
   - Sign up & Sign in with Email/Password or Google OAuth popup.
   - User profile, problem solve history, daily streaks, and topic completion synced in Firestore.

2. **Monaco Code Editor & Sandboxed Test Runner**
   - Multi-language support (JavaScript, Python 3, C++, Java).
   - Instant syntax highlighting, line numbers, and theme support.
   - Isolated execution with automated test case pass/fail evaluations and error diagnostics.

3. **Live Peer Collaboration & Study Rooms**
   - Instant room creation and code joining.
   - Real-time bidirectional code editing over WebSockets.
   - In-room live group chat and presence indicators.

4. **AI DSA Tutor & Savage Roaster**
   - 4 coaching tones: *Senior SDE, Socratic Guide, ELI5 Mentor, and Savage Roaster*.
   - 5-step progressive hint ladder preventing early solution spoilers.
   - 45-minute simulated FAANG-style DSA technical interview with rubric scorecards.
