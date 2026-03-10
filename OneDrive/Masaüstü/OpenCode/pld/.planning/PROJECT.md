# Student Dashboard UI Refresh

## What This Is

This is a brownfield UI refresh for the student experience inside the existing PLD web app. The work focuses on making the student dashboard in `client/src/pages/StudentDashboard.jsx` simpler, friendlier, and more useful for day-to-day student actions without redesigning the rest of the platform.

## Core Value

Students should land on a calm, clear dashboard that immediately helps them see what matters next and act on it without distraction.

## Requirements

### Validated

- ✓ Students can access a dedicated student dashboard with role-based routing and major gating — existing
- ✓ Students can view session-related information and join eligible future sessions from the dashboard — existing
- ✓ Students can access AI practice mode, announcements, and PLD preference editing from the dashboard — existing

### Active

- [ ] Redesign the student dashboard around essential student actions instead of admin-style summary widgets
- [ ] Prioritize sessions and AI practice as the primary dashboard actions
- [ ] Remove or demote unnecessary elements, including the current "Active PLDs" emphasis and other clutter-heavy sections
- [ ] Keep PLD preference editing available, but make it smaller, less dominant, and clearer
- [ ] Show session start times clearly in the PLD preference area
- [ ] Fix the current PLD preference interaction path that produces errors for students
- [ ] Make the tone and visual design calm, simple, and student-friendly

### Out of Scope

- Mentor or admin dashboard redesign — this work is only for the student dashboard
- Session, announcement, or AI practice backend re-architecture — the goal is to improve the student-facing experience, not rebuild those systems
- Broad navigation or auth flow changes outside the student dashboard route — keep the rest of the application stable during this pass

## Context

The existing app is a React frontend in `client/` backed by an Express and Supabase backend in `server/`. The current student dashboard already pulls sessions, joinable sessions, and announcements, and it exposes AI practice plus PLD availability editing in `client/src/pages/StudentDashboard.jsx`.

The current dashboard feels heavier than necessary for students because it leads with stats, promotional treatment, and session blocks that do not reflect the clearest next action. The user explicitly wants a simpler dashboard, does not need the current "Active PLDs" emphasis, wants sessions and practice surfaced first, and wants the PLD preference area kept only as a lightweight utility. There is also a known UX bug in the preference interaction path that needs to be corrected during this work.

## Constraints

- **Tech stack**: Keep the implementation within the existing React + CSS structure in `client/src/pages/StudentDashboard.jsx` and `client/src/pages/StudentDashboard.css` — this should fit the established frontend stack
- **Brownfield stability**: Preserve existing student capabilities such as joining sessions, opening practice mode, and updating PLD preferences — the redesign should simplify without regressing functionality
- **Scope**: Focus on the student dashboard route and closely related UI behavior only — this effort should not expand into a full product-wide redesign

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as a brownfield dashboard redesign, not a new product build | The platform already exists and the user wants a focused improvement to one area | — Pending |
| Prioritize sessions and AI practice in the dashboard hierarchy | These are the actions the user wants most visible to students | — Pending |
| Keep PLD preference editing on the dashboard in a reduced form | The feature is still needed, but it should feel secondary and clearer | — Pending |
| Aim for a calm and simple student-facing tone | The user wants the dashboard to feel friendly without unnecessary visual noise | — Pending |

---
*Last updated: 2026-03-10 after initialization*
