# Structure

## Top-Level Layout
- `client/`: React SPA, Vite config, frontend assets, and browser-side service code.
- `server/`: Express API, Supabase data access, Discord integrations, and backend tests/scripts.
- `.planning/`: planning workspace; `.planning/codebase/` is where mapper outputs are written.
- `.codex/`: local Codex/GSD workflow assets and skills.
- `.vercel/`: deployment metadata.
- `node_modules/`: root dependency install, even though the active apps also carry their own package manifests.
- `package.json`: minimal root manifest; it is not the main app entry for either runtime.
- `README.md`: present but minimal.

## Frontend Layout
- `client/src/main.jsx`: browser bootstrap.
- `client/src/App.jsx`: route table and route guards.
- `client/src/pages/`: feature/page modules such as `Dashboard.jsx`, `SessionRun.jsx`, `StudentDashboard.jsx`, `Announcements.jsx`, and related CSS files.
- `client/src/components/`: shared shell/UI pieces such as `Layout.jsx`, `Sidebar.jsx`, `DashboardCenter.jsx`, and modal styles.
- `client/src/context/`: global React providers for auth, theme, toast, and confirm dialogs.
- `client/src/services/`: browser-side helpers; currently includes `aiService.js`.
- `client/src/assets/`: static images like `logo.png`.
- `client/src/constants/`: directory exists but was empty at inspection time.
- `client/src/api.js`: centralized fetch wrapper used across pages.
- `client/vite.config.js`, `client/eslint.config.js`, `client/vercel.json`: frontend toolchain/deployment config.

## Backend Layout
- `server/index.js`: Express and Discord process entry.
- `server/routes/`: route-per-domain organization, including `auth.js`, `sessions.js`, `students.js`, `questions.js`, `chat.js`, `admin.js`, `profile.js`, `users.js`, `announcements.js`, `majors.js`, plus `register.js` and `verify.js`.
- `server/controllers/`: controller-per-domain organization mirroring most route files.
- `server/models/`: Supabase-backed data modules such as `userModel.js`, `studentModel.js`, `questionModel.js`, `sessionModel.js`, `chatModel.js`, `announcementModel.js`, and `majorModel.js`.
- `server/utils/`: shared helpers including `authMiddleware.js`, `authzMiddleware.js`, `supabaseClient.js`, `envValidation.js`, `jwtSecret.js`, `generateCode.js`, and `verificationStore.js`.
- `server/tests/`: backend-only test files, currently focused on access-control guardrails.
- `server/supabase_schema.sql`: schema reference script.
- `server/cron.js`, `server/fix-db.js`, `server/test-db.js`, `server/test-supabase.js`, `server/test-supabase2.js`: operational/support scripts outside the main route-controller-model layout.

## Naming And Organization Patterns
- Frontend files use React component naming with PascalCase page/component filenames such as `client/src/pages/StudentReportsPage.jsx`.
- Frontend styles are mostly colocated as sibling `.css` files next to pages/components rather than a single global module system.
- Backend files use domain-oriented grouping first, then layer naming second: `routes/<domain>.js`, `controllers/<domain>Controller.js`, `models/<domain>Model.js`.
- Backend source is CommonJS (`require`/`module.exports`), while frontend source is ESM (`import`/`export`).
- Data field naming mixes camelCase and snake_case to match database history, for example `mentorId`, `createdAt`, `scheduled_date`, and `avatar_url`.
- Session and chat records store rich nested JSON in Supabase instead of being fully normalized across many tables.

## Notable Boundaries
- There is no shared `src/`, `packages/`, or `lib/` directory spanning frontend and backend.
- There is no dedicated `services/` layer on the backend; models are the lowest abstraction and controllers own much of the orchestration.
- There is no frontend test directory and no root test suite was found.
- There is no migrations directory beyond `server/supabase_schema.sql` and the one-off script `server/models/migrateToSupabase.js`.
- There is no `.github/` CI/workflow directory in the inspected repo.

## Support And Planning Areas
- `.planning/codebase/`: intended destination for codebase map documents.
- `.codex/skills/` and `.codex/get-shit-done/`: local workflow/skill infrastructure, not application runtime code.
- `diff_report.txt` and `tall -g vercel`: standalone artifacts at repo root; they do not fit the main app directory conventions.

## Quick Mental Map
- If the concern is browser UI, start in `client/src/App.jsx`, then follow into `client/src/pages/` and `client/src/api.js`.
- If the concern is an HTTP endpoint, start in `server/index.js`, then `server/routes/`, then the matching controller and model.
- If the concern is persistence, inspect `server/models/db.js`, `server/models/*.js`, and `server/supabase_schema.sql`.
- If the concern is access control, inspect `server/utils/authMiddleware.js` and `server/utils/authzMiddleware.js`.
- If the concern is Discord or scheduled notifications, inspect `server/index.js`, `server/routes/register.js`, `server/routes/announcements.js`, `server/controllers/sessionController.js`, and `server/cron.js`.
