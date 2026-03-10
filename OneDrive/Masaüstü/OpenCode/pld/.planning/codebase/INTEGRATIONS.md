# Integrations

## Databases And Persistence
- Primary database: Supabase/Postgres via `@supabase/supabase-js` in `server/models/db.js`.
- Runtime tables actually used by models/routes:
  - `users` in `server/models/userModel.js`
  - `students` in `server/models/studentModel.js`
  - `questions` in `server/models/questionModel.js`
  - `sessions` in `server/models/sessionModel.js`
  - `chats` in `server/models/chatModel.js`
  - `announcements` and `announcement_recipients` in `server/models/announcementModel.js`
  - `majors` in `server/models/majorModel.js`
- Schema bootstrap file exists at `server/supabase_schema.sql`, but it does not fully reflect all tables/columns used by current runtime code.
- Legacy/local persistence:
  - `server/db.json.backup` is a backup artifact, not active runtime storage.
  - `lowdb` is referenced only as migration residue; it is not the active datastore.

## Authentication And Authorization
- Primary auth mechanism: JWT bearer tokens.
  - Token issuance in `server/controllers/authController.js`
  - Token validation in `server/utils/authMiddleware.js`
  - Required secret enforcement in `server/utils/envValidation.js`
- Password hashing: `bcryptjs` in `server/controllers/authController.js` and `server/controllers/profileController.js`.
- Role/ownership authorization:
  - Role gates in `server/utils/authzMiddleware.js`
  - Session membership/chat access checks in `server/utils/authzMiddleware.js`
- Admin override path:
  - `x-admin-password` header accepted in `server/utils/authMiddleware.js`
  - Password sourced from `ADMIN_PASSWORD` or `VITE_ADMIN_PASSWORD`, with `'admin123'` fallback if unset.

## Discord Integration
- Discord bot client is initialized in `server/index.js` using `discord.js`.
- Runtime Discord capabilities actually wired:
  - Registration verification code DM flow in `server/routes/register.js` and `server/routes/verify.js`
  - Password reset code DM flow in `server/controllers/authController.js`
  - Role lookup for auto-assigning `mentor` vs `student` during register/OAuth in `server/controllers/authController.js`
  - Student membership/verification checks in `server/routes/students.js`
  - Feedback/absence/session reminder DMs in `server/controllers/sessionController.js` and `server/cron.js`
  - Announcement broadcast DMs in `server/routes/announcements.js`
- Discord OAuth is partially wired:
  - Code exchange against `https://discord.com/api/oauth2/token` in `server/controllers/authController.js`
  - User profile fetch from `https://discord.com/api/users/@me` in `server/controllers/authController.js`
  - Backend endpoint exposed at `POST /api/auth/discord/callback` in `server/routes/auth.js`
- Required Discord env/config inputs:
  - `DISCORD_TOKEN`
  - `DISCORD_GUILD_ID`
  - `DISCORD_STUDENT_ROLE_ID`
  - `DISCORD_MENTOR_ROLE_ID`
  - `DISCORD_CLIENT_ID`
  - `DISCORD_CLIENT_SECRET`
  - `REDIRECT_URI`

## AI And External APIs
- Frontend AI integration is Puter, not a backend model SDK:
  - Browser script loaded from `https://js.puter.com/v2/` in `client/index.html`
  - Calls made through `window.puter.ai.chat(...)` in `client/src/services/aiService.js`
- Puter is used for:
  - Mentor feedback generation in `client/src/services/aiService.js`
  - Student tutor chat in `client/src/services/aiService.js`
  - Practice question generation/evaluation in `client/src/services/aiService.js`
- Backend chat persistence is local app API only:
  - Frontend posts chat history to `/api/chat/save` via `client/src/services/aiService.js`
  - Backend stores chat rows in Supabase via `server/routes/chat.js` and `server/models/chatModel.js`
- Explicitly absent from runtime wiring:
  - `@google/generative-ai` is installed in `server/package.json` but not imported by runtime code.
  - `axios` is installed in `server/package.json` but not used by runtime code.

## Frontend-To-Backend Integration
- Frontend API base URL comes from `VITE_API_URL` in `client/src/api.js`.
- The SPA talks to the backend over `fetch` for auth, sessions, students, questions, profile, admin, announcements, majors, and chat persistence.
- No direct browser-side Supabase client was found; all database access goes through the backend.

## Deployment Integrations
- Frontend hosting is Vercel-oriented:
  - SPA rewrites in `client/vercel.json`
  - linked Vercel project metadata in `.vercel/project.json`
- Backend is container-ready via `server/Dockerfile`.
- Render is mentioned only in a comment in `server/index.js`; no Render config file was found.
- No Netlify, Railway, Fly.io, S3, Redis, Stripe, SendGrid, Twilio, or Sentry integration was found in runtime code.

## Operational Notes
- Background notifications rely on the backend process staying alive because `server/cron.js` uses in-process `setInterval`.
- If `DISCORD_TOKEN` is absent, several Discord send paths fall back to simulated logging instead of hard failure (`server/index.js`, `server/controllers/sessionController.js`, `server/cron.js`).
- If Supabase env vars are missing, `server/models/db.js` exits the process at startup.
