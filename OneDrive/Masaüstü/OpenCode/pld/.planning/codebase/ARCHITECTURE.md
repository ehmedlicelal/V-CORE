# Architecture

## System Shape
- The repo is a two-application JavaScript stack: a React/Vite SPA in `client/` and an Express API in `server/`.
- The frontend and backend are deployed/configured separately. `client/vercel.json` handles SPA rewrites; `server/index.js` runs the API process.
- Persistence is centered on Supabase tables accessed directly from backend model modules such as `server/models/userModel.js` and `server/models/sessionModel.js`.
- External side effects are split between Discord bot/OAuth flows on the backend and Puter AI calls in the browser via `client/src/services/aiService.js`.

## Layers
### Frontend
- Bootstrap: `client/src/main.jsx` mounts `App` inside `BrowserRouter`, `ThemeProvider`, and `AuthProvider`.
- Route shell: `client/src/App.jsx` defines page routing and simple role gates with `PrivateRoute` and `MentorRoute`.
- Layout/navigation: `client/src/components/Layout.jsx` and `client/src/components/Sidebar.jsx` wrap most authenticated pages.
- State/context: auth, theme, toast, and confirm concerns live in `client/src/context/AuthContext.jsx`, `client/src/context/ThemeContext.jsx`, `client/src/context/ToastContext.jsx`, and `client/src/context/ConfirmContext.jsx`.
- Data access: `client/src/api.js` is the main HTTP client and centralizes auth/admin headers plus response parsing.
- Feature pages: screen-level modules live under `client/src/pages/` and call `client/src/api.js` or `client/src/services/aiService.js` directly.

### Backend
- Process bootstrap: `server/index.js` initializes environment validation, Express middleware, Discord client wiring, route mounting, and the in-process cron loop.
- Routing layer: files under `server/routes/` map HTTP paths to controller functions and apply auth/authz middleware.
- Controller layer: files under `server/controllers/` validate request payloads and orchestrate model calls plus Discord/API side effects.
- Model layer: files under `server/models/` talk directly to Supabase using the shared client from `server/models/db.js`.
- Utility layer: files under `server/utils/` hold JWT handling, authorization helpers, environment checks, code generation, and the shared verification store.

## Primary Data Flow
### Standard app request
1. A page in `client/src/pages/` calls a helper from `client/src/api.js`.
2. `client/src/api.js` builds headers from browser storage and sends `fetch` requests to `VITE_API_URL`.
3. A route in `server/routes/*.js` applies `server/utils/authMiddleware.js` and, where needed, `server/utils/authzMiddleware.js`.
4. A controller in `server/controllers/*.js` invokes one or more model functions.
5. A model in `server/models/*.js` reads/writes Supabase tables.
6. JSON returns to the SPA, where page components render or update local React state.

### Session and reporting flow
- Mentors create sessions through `server/controllers/sessionController.js`, which snapshots selected question sets into the `sessions` row via `server/models/sessionModel.js`.
- Student progress, notes, grades, status, and generated report text are stored inside the `students` JSON array embedded in each session row.
- Completed-session data is aggregated in `server/models/sessionModel.js#getLeaderboard()` to build leaderboard output.

### Chat and AI flow
- Tutor/feedback generation is client-led. `client/src/services/aiService.js` calls `window.puter.ai.chat(...)` in the browser.
- Chat persistence is backend-led. The frontend saves user/model messages to `server/routes/chat.js`, and `server/models/chatModel.js` appends them to the `chats` table.
- The backend does not host its own LLM orchestration layer; it mainly stores chat history and access-controls it.

### Discord flow
- `server/index.js` constructs a Discord client and injects it into requests as `req.discordClient`.
- Registration and verification routes in `server/routes/register.js` and `server/routes/verify.js` use an in-memory verification map from `server/utils/verificationStore.js`.
- Auth, session feedback, announcements, and the cron job all send Discord DMs from inside backend request/process code.

## Major Entry Points
- Frontend browser entry: `client/src/main.jsx`
- Frontend route composition: `client/src/App.jsx`
- Backend server entry: `server/index.js`
- API route groups: `server/routes/auth.js`, `server/routes/sessions.js`, `server/routes/students.js`, `server/routes/questions.js`, `server/routes/chat.js`, `server/routes/admin.js`, `server/routes/profile.js`, `server/routes/users.js`, `server/routes/announcements.js`, `server/routes/majors.js`
- Background job entry: `server/cron.js`
- Database bootstrap/schema reference: `server/models/db.js`, `server/supabase_schema.sql`

## Cross-Cutting Abstractions
- Authentication: browser token persistence in `client/src/context/AuthContext.jsx`; JWT/admin-password parsing in `server/utils/authMiddleware.js`.
- Authorization: reusable role and session-membership guards in `server/utils/authzMiddleware.js`.
- Environment/config: `.env` files in `client/` and `server/`; JWT secret validation in `server/utils/envValidation.js` and `server/utils/jwtSecret.js`.
- UI feedback: global toast and confirm providers in `client/src/context/ToastContext.jsx` and `client/src/context/ConfirmContext.jsx`.
- Shared transport conventions: `client/src/api.js` normalizes base URL, headers, and response parsing for most frontend API calls.

## Architectural Gaps / Explicit Absences
- No shared package for DTOs, schemas, or types between `client/` and `server/`.
- No dedicated backend service layer between controllers and models; controllers often coordinate business logic directly.
- No websocket, SSE, or other realtime channel was found; interactions are request/response plus Discord DMs.
- No queue/worker service was found; scheduled notifications run inside the API process via `setInterval` in `server/cron.js`.
- No backend-owned AI runtime was found; AI generation depends on browser-side `window.puter`.
- No monorepo build orchestration beyond separate `client/package.json` and `server/package.json` was found.
