# Conventions

## Style Baseline

- The repo uses two style baselines: modern ESM React in `client/src/` and CommonJS Express in `server/`.
- `client/eslint.config.js` is the only formal style config present. It enables the core ESLint recommended rules plus `react-hooks` and Vite refresh rules. There is no Prettier config in the repo.
- Formatting is not fully normalized. Files such as `client/src/main.jsx` use no semicolons, while `client/src/App.jsx`, `client/src/api.js`, and most server files use semicolons.
- Quotes are also mixed. Frontend files commonly use both single and double quotes in adjacent files, for example `client/src/App.jsx` vs `client/src/pages/Login.jsx`.
- CSS is mostly plain `.css` files colocated with components or pages, for example `client/src/components/Layout.css` and `client/src/pages/Dashboard.css`. Inline `style` objects are also common in page components such as `client/src/pages/Login.jsx` and `client/src/pages/Questions.jsx`.

## Naming

- React components, pages, and providers use PascalCase file names and exports, for example `client/src/components/Layout.jsx`, `client/src/pages/StudentDashboard.jsx`, and `client/src/context/AuthContext.jsx`.
- Hooks exposed from context providers use the `useX` pattern, for example `useAuth`, `useToast`, `useConfirm`, and `useTheme` in `client/src/context/`.
- Backend folders follow Express layering with lower-case plural or singular file names by role: routes in `server/routes/`, controllers in `server/controllers/`, models in `server/models/`, and middleware in `server/utils/`.
- Backend functions are mostly lower camel case, for example `createSession`, `getMySessions`, `findUserByDiscordId`, and `requireSessionMentorOwner`.
- Data naming is mostly camelCase in application code, but Supabase row fields still include snake_case columns such as `scheduled_date`, `avatar_url`, `pld_day`, and `pld_time` in `server/models/sessionModel.js`, `server/models/userModel.js`, and `server/controllers/profileController.js`. Boundary translation is manual rather than centralized.

## State Management

- There is no Redux, Zustand, React Query, or other app-wide state library in the repo.
- Shared client state is handled with React Context providers in `client/src/context/AuthContext.jsx`, `client/src/context/ThemeContext.jsx`, `client/src/context/ToastContext.jsx`, and `client/src/context/ConfirmContext.jsx`.
- Feature state is local to pages and components via `useState` and `useEffect`, often with large stateful page components such as `client/src/pages/Dashboard.jsx`, `client/src/pages/Questions.jsx`, and `client/src/pages/SessionRun.jsx`.
- Persistence is done directly against browser storage. `client/src/context/AuthContext.jsx` restores `token` and `user` from `localStorage`, `client/src/context/ThemeContext.jsx` persists theme to `localStorage`, and `client/src/api.js` reads `adminAuth` from `sessionStorage`.
- Network state is handled imperatively. Components call helpers from `client/src/api.js`, then update local state or toast/error state themselves. There is no centralized caching, invalidation, or query abstraction.

## Error Handling

- Client API calls are centralized in `client/src/api.js`, where `handleResponse()` converts non-OK fetch responses into thrown `Error` objects with either JSON `error` text or a truncated plain-text fallback.
- Client pages usually catch errors at the call site and then either set a local error string or show a toast. Examples include `client/src/pages/Login.jsx`, `client/src/pages/Questions.jsx`, `client/src/pages/Dashboard.jsx`, and `client/src/pages/SessionRun.jsx`.
- Console logging is used heavily for diagnostics on both sides of the stack. `console.error`, `console.warn`, and `console.log` appear throughout `client/src/` and `server/`.
- Server controllers generally wrap each handler in `try/catch` and respond with `res.status(...).json({ error: ... })`, for example `server/controllers/authController.js`, `server/controllers/sessionController.js`, and `server/controllers/profileController.js`.
- There is no centralized Express error middleware. Error handling is repeated inline in each controller.
- Model-layer error behavior is inconsistent. Some functions throw on failure, some return `null`, and some log and return `[]` or boolean flags. `server/models/sessionModel.js` shows all three patterns.

## Validation

- Validation is mostly manual and inline. Controllers and pages check required fields with direct `if` statements rather than schema validation libraries.
- Server request validation examples:
  - `server/controllers/authController.js` checks required registration, login, reset, and OAuth fields.
  - `server/controllers/sessionController.js` checks `groupName` and `topicIds`.
  - `server/controllers/profileController.js` rejects empty `username` or `discordId` values on partial updates.
- Authorization and access validation are enforced in middleware rather than inside every handler. See `server/utils/authMiddleware.js` and `server/utils/authzMiddleware.js`.
- Environment validation is minimal but explicit. `server/utils/envValidation.js` rejects missing or default-like `JWT_SECRET`, and `server/models/db.js` exits the process when Supabase credentials are missing.
- No `zod`, `joi`, `yup`, or similar schema library is present in the repo.

## Common Implementation Patterns

- Frontend routing is defined centrally in `client/src/App.jsx` with small wrapper guards `PrivateRoute` and `MentorRoute`.
- The client uses a thin API layer in `client/src/api.js` rather than per-feature service modules, except for AI-specific logic in `client/src/services/aiService.js`.
- Cross-cutting UI behaviors are implemented as providers that render UI alongside `children`, such as the toast container in `client/src/context/ToastContext.jsx` and the modal in `client/src/context/ConfirmContext.jsx`.
- Backend request flow usually follows route -> middleware -> controller -> model, as seen in `server/routes/sessions.js`, `server/controllers/sessionController.js`, and `server/models/sessionModel.js`.
- Supabase access is concentrated in model files through `server/models/db.js`. There is no repository layer beyond the model modules.
- Several backend entities embed denormalized arrays or nested objects directly in session rows, especially in `server/models/sessionModel.js` where `students`, `questions`, and derived topic snapshots are stored inside the session payload.
- Manual compatibility shims exist where the data model has evolved. Examples include both `topicIds` and `topicName/topicNames` in `server/models/sessionModel.js`, plus avatar field translation in `server/models/userModel.js`.
- Security-sensitive conventions are present but uneven:
  - JWT signing and verification are supposed to go through `server/utils/jwtSecret.js`, and this is covered by tests.
  - Admin access can also be granted through `x-admin-password` handling in `server/utils/authMiddleware.js`.
  - The client sends that admin header from `client/src/api.js` when `sessionStorage.adminAuth === 'true'`.

## Not Present

- No monorepo workspace tooling is configured beyond separate `client/package.json` and `server/package.json`.
- No generated API client, shared TypeScript types, or runtime schema package is present.
- No central logging, metrics, tracing, or error-reporting integration is present.
- No formal formatting standard is enforced across both halves of the repo.
