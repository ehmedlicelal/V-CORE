# Testing

## Current Setup

- There is no `test` script in `package.json`, `client/package.json`, or `server/package.json`.
- There is no Jest, Vitest, Mocha, Cypress, Playwright, or coverage tool configuration in the repo.
- The only real automated tests live under `server/tests/`.
- Frontend test files are absent from `client/src/` and `client/` as a whole.

## Frameworks And Execution Style

- `server/tests/access-control-guardrails.task1.test.js` and `server/tests/access-control-guardrails.task2.test.js` use Node's built-in test runner via `require('node:test')` and `require('node:assert/strict')`.
- `server/tests/access-control-guardrails.plan02.task1.test.js` and `server/tests/access-control-guardrails.plan02.task2.test.js` are standalone Node scripts. They use `node:assert/strict`, build temporary Express apps, call `run()` manually, and set `process.exitCode = 1` on failure instead of registering tests with `node:test`.
- The test files use direct module-cache mocking with `require.cache[...] = { exports: ... }` rather than a dedicated mocking framework.
- Several manual environment-check scripts exist outside `server/tests/`, including `server/test-db.js`, `server/test-supabase.js`, and `server/test-supabase2.js`. These are diagnostics, not part of an automated suite.

## What Is Covered

- Startup secret validation is covered in `server/tests/access-control-guardrails.task1.test.js`.
- Auth secret usage conventions are covered by source-inspection assertions in `server/tests/access-control-guardrails.task1.test.js`.
- Authorization middleware behavior is covered in `server/tests/access-control-guardrails.task2.test.js`.
- Route-level access control for admin routes is covered in `server/tests/access-control-guardrails.plan02.task1.test.js`.
- Route-level access control for session ownership and mentor-only actions is covered in `server/tests/access-control-guardrails.plan02.task2.test.js`.
- Some tests also verify client API header usage by reading `client/src/api.js` as source text instead of exercising the browser app.

## Where Tests Are Missing

- There are no tests for React pages, components, hooks, or context providers in `client/src/`.
- There are no API integration tests for most backend controllers such as `server/controllers/authController.js`, `server/controllers/profileController.js`, `server/controllers/chatController.js`, or `server/controllers/sessionController.js` beyond access-control checks.
- There are no direct unit tests for the Supabase-backed model modules in `server/models/`.
- There are no end-to-end tests covering login, session creation, question management, profile updates, announcements, or AI practice flows.
- There are no snapshot, visual regression, accessibility, or browser automation tests.
- There is no CI configuration in the repo to show automated test execution.

## Coverage Reality

- Coverage is narrow and security-focused. The tested surface is mainly JWT secret guardrails and route authorization behavior.
- Most business logic is effectively untested, especially the large stateful frontend pages in `client/src/pages/` and the data mutation paths in `server/models/`.
- Database behavior is largely validated by ad hoc scripts such as `server/test-db.js` and `server/test-supabase.js`, not repeatable automated assertions.
- No coverage reports, thresholds, or instrumentation are configured, so there is no quantitative coverage baseline.

## Practical Notes

- To run the Node test-runner files, the likely command is `node --test server/tests/*.test.js`.
- To run the standalone guardrail scripts, they would need to be invoked individually with `node server/tests/access-control-guardrails.plan02.task1.test.js` and `node server/tests/access-control-guardrails.plan02.task2.test.js`.
- The plan02 scripts and the manual Supabase checks depend on runtime `fetch`, temporary local HTTP servers, and in some cases live environment configuration.
- Because there is no single test entrypoint, test discovery and execution are manual today.
