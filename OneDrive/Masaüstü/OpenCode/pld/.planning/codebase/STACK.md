# Stack

## Overview
- Monorepo-style Node/JavaScript app with separate frontend in `client/` and backend in `server/`.
- Primary languages: JavaScript and JSX. No TypeScript files or `tsconfig.*` were found.
- Runtime split:
  - Browser SPA in `client/src/main.jsx`
  - Node.js server in `server/index.js`

## Frontend
- Framework: React 19 in `client/package.json`.
- Router: `react-router-dom` with `BrowserRouter` in `client/src/main.jsx` and route table in `client/src/App.jsx`.
- Build tool: Vite 7 via `client/package.json` scripts and config in `client/vite.config.js`.
- Module format: ESM (`"type": "module"` in `client/package.json`).
- Styling:
  - Plain CSS modules/files under `client/src/**/*.css`
  - Tailwind packages exist in `client/package.json`, but `client/vite.config.js` does not register `@tailwindcss/vite` and no `tailwind.config.*` file was found.
- UI/runtime libraries actually imported:
  - `lucide-react` in `client/src/components/Sidebar.jsx`
  - `jspdf` in `client/src/pages/SessionRun.jsx`
  - `mammoth` in `client/src/pages/Questions.jsx`
- Frontend AI dependency actually used at runtime: Puter browser SDK loaded from `client/index.html`.

## Backend
- Framework: Express 4 in `server/index.js`.
- Runtime style: CommonJS (`require(...)`) across `server/**/*.js`.
- Server middleware:
  - `cors` in `server/index.js`
  - JSON body parsing in `server/index.js`
- Auth/token stack:
  - `jsonwebtoken` in `server/utils/authMiddleware.js` and `server/controllers/authController.js`
  - `bcryptjs` in `server/controllers/authController.js` and `server/controllers/profileController.js`
- Bot/runtime services:
  - `discord.js` client initialized in `server/index.js`
  - Background scheduler implemented with native `setInterval` in `server/cron.js`
- Database client:
  - `@supabase/supabase-js` in `server/models/db.js`
  - Shared client also duplicated in `server/utils/supabaseClient.js`

## Package Layout
- Root `package.json` is not the main app entrypoint; it only declares `bcryptjs`.
- Frontend package manifest: `client/package.json`
- Backend package manifest: `server/package.json`
- Root `package-lock.json` appears separate from `client/package-lock.json`/`server/package-lock.json`; only the root lockfile is present at repo root.

## Configuration
- Frontend env vars used:
  - `VITE_API_URL` in `client/src/api.js` and `client/src/services/aiService.js`
  - `VITE_ADMIN_PASSWORD` in `client/src/api.js` and `client/src/pages/AdminPanel.jsx`
- Backend env vars used:
  - `PORT` in `server/index.js`
  - `JWT_SECRET` in `server/utils/envValidation.js`
  - `SUPABASE_URL`, `SUPABASE_KEY` in `server/models/db.js`
  - `DISCORD_TOKEN` in `server/index.js` and `server/cron.js`
  - `DISCORD_GUILD_ID`, `DISCORD_STUDENT_ROLE_ID`, `DISCORD_MENTOR_ROLE_ID` in `server/controllers/authController.js`
  - `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `REDIRECT_URI` in `server/controllers/authController.js`
  - `ADMIN_PASSWORD` fallback in `server/utils/authMiddleware.js`
- `dotenv` is loaded in `server/index.js`, `server/models/db.js`, and `server/utils/supabaseClient.js`.
- No checked-in `.env` file was found in the repo scan.

## Tooling
- Frontend linting: ESLint 9 flat config in `client/eslint.config.js`.
- Frontend scripts: `dev`, `build`, `lint`, `preview` in `client/package.json`.
- Backend scripts: `start`, `dev` (`nodemon`) in `server/package.json`.
- Backend tests exist under `server/tests/`, but no `test` script is declared in `server/package.json`.
- No frontend test framework config was found (`vitest`, `jest`, `playwright`, `cypress` not present in the scanned file set).

## Deployment And Delivery
- Frontend SPA rewrite config for Vercel in `client/vercel.json`.
- Vercel project metadata exists in `.vercel/project.json`.
- Alternative SPA redirect note exists in `client/public/_redirects`, but it is comment-only guidance rather than active config.
- Backend containerization: Dockerfile in `server/Dockerfile` based on `node:20-alpine`, exposing port `5000`.
- No `docker-compose`, Kubernetes manifests, GitHub Actions workflows, or infrastructure-as-code files were found.

## Notable Unwired Or Legacy Dependencies
- `@google/generative-ai` is listed in `server/package.json`, but no runtime import was found in `server/`.
- `axios` is listed in `server/package.json`, but no runtime import was found in `server/`.
- `lowdb` is listed in `server/package.json`; current code treats it as legacy/migration residue in `server/models/db.js` and `server/models/migrateToSupabase.js`.
