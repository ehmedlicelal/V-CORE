# Concerns

## High Risk
- Admin access is effectively password-based and exposed to the client: `client/src/pages/AdminPanel.jsx` and `client/src/api.js` use `VITE_ADMIN_PASSWORD` with a fallback of `admin123`, while `server/utils/authMiddleware.js` accepts `x-admin-password`, and `server/routes/users.js` exposes `/api/users/admin` without `requireRole('admin')`.
- Tenant isolation is weak in student data. `server/models/studentModel.js` ignores `mentorId` in `getStudents`, and `updateStudent`, `deleteStudent`, and `deleteAllStudents` mutate by row id only. `server/routes/students.js` adds no ownership guard, so one mentor can likely read or mutate another mentor's roster.
- Question-set ownership is similarly under-protected. `server/models/questionModel.js` scopes reads and bulk delete, but `updateQuestionSet` and `deleteQuestionSet` do not constrain by `mentorId`, and `server/routes/questions.js` does not add a role or ownership check.
- Session access has at least one concrete identity bug. `server/controllers/sessionController.js` checks student membership with `req.user.username`, while the rest of the codebase usually keys session membership by `discordId`; valid students can be rejected or matched incorrectly.
- Session mutation protection is inconsistent. `server/routes/sessions.js` protects most write routes with `requireSessionMentorOwner`, but `DELETE /:sessionId/students/:studentId` is left unguarded beyond basic auth.
- Profile updates can report success without persisting all fields. `server/controllers/profileController.js` sends `pld_day` and `pld_time` updates, but `server/models/userModel.js` drops them via its allowlist.
- Verification state is fragmented and ephemeral. Password reset uses `verifications` exported from `server/index.js`, while Discord verification uses `server/utils/verificationStore.js`; both are in-memory only, and `server/controllers/authController.js` also creates a fragile circular dependency on `server/index.js`.
- Sensitive operational data is written to logs. `server/index.js` logs the Discord token prefix, token length, and external diagnostics, and `server/models/db.js` logs the Supabase URL on startup.

## Fragile Areas
- `server/index.js` enables unrestricted `cors()` and accepts `express.json({ limit: '50mb' })`. Combined with `server/controllers/profileController.js` storing raw avatar payloads, this widens abuse and resource-exhaustion risk.
- `server/models/sessionModel.js` and `server/models/chatModel.js` store mutable session state and chat history as JSON blobs. Most updates are read-modify-write cycles on one row, so concurrent writes are likely last-write-wins.
- `server/models/sessionModel.js` uses full-table reads in `getSessionsForStudent` and `getJoinableSessions`, and `server/models/studentModel.js` uses full-table reads in `getStudents`. `server/routes/students.js` also triggers background Discord membership checks for each returned student after every list request.
- `server/cron.js` runs a `setInterval` worker inside the web process, has no visible leader-election or deduplication, and marks sessions as notified even if some DMs fail.
- `client/src/services/aiService.js` depends on `window.puter` and performs primary AI flows in the browser. Backend chat-save failures are swallowed, so conversation state can drift silently.

## Testing Gaps
- The automated test surface is narrow: only four files exist under `server/tests`, and they mainly cover auth/access guardrails.
- There is no visible test script in `server/package.json` or the root `package.json`, which increases the chance that tests are stale or skipped during normal development.
- There is no obvious automated coverage for Supabase queries, profile persistence, announcements, cron notifications, Discord verification, AI-assisted flows, or the React pages under `client/src/pages`.

## Planning Risks
- `server/supabase_schema.sql` is materially behind the application code. It does not define several fields and tables used elsewhere, including user profile fields, announcement recipient data, majors, session notification fields, and question sharing state.
- `server/models/db.js`, `server/db.json.backup`, and `server/models/migrateToSupabase.js` suggest the repo is still carrying migration debt from `lowdb` to Supabase.
- [Inference] The system treats Discord usernames as durable identifiers in multiple places (`server/controllers/authController.js`, `server/routes/register.js`, `server/cron.js`, `server/controllers/sessionController.js`). If usernames change or collide, auth, verification, and DM delivery will be brittle.
- [Inference] Delivery risk is elevated because `README.md` is effectively empty, startup requires many environment variables, and the checked-in schema/setup story does not match runtime expectations.
