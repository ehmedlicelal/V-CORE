# Project Research Summary

**Project:** Student Dashboard UI Refresh
**Domain:** Brownfield React student dashboard redesign
**Researched:** 2026-03-10
**Confidence:** MEDIUM-HIGH

## Executive Summary

This project is a focused brownfield redesign of the student dashboard inside the existing PLD web app, not a product rewrite. The research is consistent across stack, feature, architecture, and pitfall analysis: the current dashboard already has the right capabilities, but its information hierarchy is wrong for students. The roadmap should therefore prioritize reordering the experience around the student's next action, keeping sessions and AI practice prominent, demoting or removing admin-style noise, and preserving the existing backend/API contracts wherever possible.

The recommended approach is to sequence the work as an in-place refactor rather than a styling pass. Research points to a safer path: first stabilize the dashboard view model and task order, then introduce clearer section boundaries and CTA hierarchy, then apply the calmer visual redesign, then repair the PLD preference flow and normalize time handling, and only then harden the responsive and regression layer. The main risk is treating this as surface polish while leaving brittle data derivation, inconsistent time logic, and the known PLD preference error path intact. If that happens, the page may look better while remaining confusing or unreliable.

## Key Findings

### Recommended Stack

The stack recommendation is deliberately conservative because this is a single-route brownfield refresh. The existing React 19, React Router 7, Vite, plain CSS, and Express API setup is already sufficient for the redesign. The research strongly argues against adding a large component framework or introducing a dashboard-only styling paradigm, because either choice would expand scope and create a second frontend language for one page.

Roadmap implication: phases should assume no stack migration. The implementation should stay inside the current route, CSS file, and existing API boundaries, with optional extraction of small presentational sections and pure selector helpers only where they reduce risk.

**Core technologies:**
- React 19.2.0: existing view layer for the dashboard refresh and the right place to restructure section order and rendering logic.
- React Router 7.13.0: existing navigation model for session, practice, and announcement actions without routing churn.
- Plain CSS with existing variables: best fit for a calm redesign that matches the current app and avoids a styling migration.
- Express API + current endpoints: sufficient for sessions, joinable sessions, announcements, and profile updates, so backend rework should stay out of roadmap scope unless a blocking bug is confirmed.

### Expected Features

The launch surface is clear and narrow. The MVP is not "more dashboard"; it is one clearer dashboard. P1 features are a top next-action area, a clear sessions hierarchy, a persistent practice path, a compact announcements digest, a compact PLD preference summary with edit access, and calm empty states. P2 items such as personalized guidance, soft progress cues, or pre-session hints can improve the experience later, but they should not delay the redesign or complicate the first pass.

Roadmap implication: the roadmap should optimize for information hierarchy and task completion, not for adding new capabilities. The current "stats-heavy" and "multiple hero" tendencies are explicitly anti-features for this project.

**Must have for launch:**
- One top next-action area that chooses between join now, upcoming session, or practice now.
- Sessions shown in a clear hierarchy, with the nearest or most relevant session first.
- A persistent AI practice entry near the top as the fallback primary action.
- A compact announcements digest with short previews and a view-all path.
- A compact peer learning preference utility that stays available but no longer dominates the page.
- Calm empty states that always point to a next useful action.

**Should have after launch validation:**
- Personalized next-step messaging if the ranking logic proves trustworthy.
- A gentle progress cue that does not turn into an admin KPI strip.
- Lightweight pre-session context attached to the next session.

**Defer:**
- Rich learning history, achievements, or recommendation-heavy surfaces.
- Broader dashboard redesign beyond the student route.
- Backend or API redesign unless required to fix a confirmed blocker in the preference flow.

### Architecture Approach

The architecture research is unusually aligned with the roadmap needs. The page should remain the route boundary, but it should stop mixing fetch orchestration, filtering, sorting, time logic, and rendering in one place. The recommended shape is a page-level view model backed by pure derivation helpers, with small presentational sections for hero/next action, primary actions, compact preferences, and secondary information. This is not abstraction for its own sake; it is the mechanism that makes safe UI hierarchy changes possible.

**Major components and seams:**
1. `StudentDashboard.jsx`: keeps page lifecycle, redirects, data fetch orchestration, and section ordering.
2. Selector or view-model helpers: normalize session state, next action ranking, announcement previews, and preference display rules.
3. Presentational sections: render hero/next action, primary session/practice actions, compact preferences, and secondary information without re-deriving data.
4. `StudentDashboard.css`: remains the styling entry point for the calmer visual system and responsive layout rules.

### Critical Pitfalls

The roadmap needs to actively prevent these pitfalls rather than assume design polish will solve them.

1. **Cognitive overload from a stats-first dashboard**: avoid by putting the next action first and demoting or removing metrics-heavy top sections.
2. **Too many competing CTAs**: avoid by enforcing one primary action per card or viewport area and keeping utilities visually quiet.
3. **Burying the next action under secondary content**: avoid by ordering the page around urgency and frequency, not around implementation history.
4. **Keeping the broken PLD preference interaction**: avoid by treating the preference flow as a core regression target, not as a minor utility.
5. **Unclear or inconsistent time information**: avoid by defining one canonical datetime source and using it everywhere in dashboard display logic.
6. **Responsive regressions during simplification**: avoid by validating mobile reading order and CTA visibility as part of the main implementation, not post-hoc polish.

## Implications for Roadmap

Based on the research, the dashboard redesign should be planned as five phases in this order.

### Phase 1: Dashboard Foundation and Information Hierarchy
**Rationale:** This must come first because both the architecture and pitfall research say the redesign will fail if the team only restyles the current page. The page needs a stable view model, a canonical interpretation of session state, and a deliberate student task order before visual work starts.
**Delivers:** content audit of what stays, moves, shrinks, or disappears; a clear section order centered on next action; selector or view-model extraction for sessions, joinable sessions, announcements, and preference status; a single canonical session datetime rule for dashboard use.
**Addresses:** top next-action card, sessions hierarchy, calm empty states.
**Avoids:** cognitive overload, buried next action, inconsistent time rules.
**Confidence:** High for the need and ordering; medium for the exact selector boundaries until implementation begins.

### Phase 2: Structural Refactor and CTA Hierarchy
**Rationale:** Once the data and content model are stable, the next safest move is to introduce section boundaries and action priority without committing to final styling. This phase turns the page from one dense surface into explicit student-facing sections.
**Delivers:** section scaffolding for next action, primary sessions/practice, compact preferences, and secondary information; one-primary-action-per-card behavior; removal of equal-weight hero competition; clearer task-led headings and scan order.
**Uses:** existing React route structure and plain CSS, with optional local subcomponents if they reduce duplication.
**Implements:** page-level view model plus presentational section pattern.
**Avoids:** competing CTAs and architecture debt hidden behind surface styling.
**Confidence:** High.

### Phase 3: Calm UI Refresh for Sessions, Practice, Announcements, and Preferences
**Rationale:** Visual redesign should land only after the section structure and CTA logic are trustworthy. At this point the team can safely apply the calm, simple, student-friendly treatment the project brief asks for.
**Delivers:** sessions-first visual hierarchy; persistent but subordinate practice entry; compact announcements digest; reduced preference surface; plain-language labels; removal or demotion of admin-style stats and loud promotional treatment.
**Uses:** existing CSS variables and page-scoped CSS rather than a new framework.
**Implements:** the student-facing layout and copy priorities identified in feature research.
**Avoids:** turning the redesign into a one-off styling island or preserving anti-features through new paint.
**Confidence:** High.

### Phase 4: PLD Preference Repair and Time/State Consistency
**Rationale:** This needs its own phase because the known preference bug and time inconsistency are functional reliability issues, not just layout issues. The UI should already be simplified before this phase so the team can test the real utility path without design churn.
**Delivers:** end-to-end fix for student preference editing; immediate UI reconciliation after save; explicit failure handling; validation of expired-slot behavior; one canonical datetime source across session and preference-related displays; copy refinements around time clarity and terminology.
**Addresses:** compact preference utility, clear session start times, error-free student preference flow.
**Avoids:** shipping a calmer UI with broken or contradictory behavior.
**Confidence:** Medium. The problem is clearly real, but the precise fix scope may touch local state, auth context refresh, or server-side validation.

### Phase 5: Responsive Hardening, Regression Coverage, and Launch QA
**Rationale:** Responsive and regression work should close the redesign, after the hierarchy, structure, styling, and critical utilities are stable. Earlier QA would churn heavily while the surface is still moving.
**Delivers:** phone/tablet/laptop validation; breakpoint cleanup; removal of layout-affecting inline styles; regression checks for next-action visibility, CTA hierarchy, preference save behavior, and time consistency; final polish for empty states and announcement density.
**Addresses:** responsive usability, launch confidence, and brownfield stability.
**Avoids:** desktop-only success masking broken mobile reading order or stale-state regressions.
**Confidence:** High for necessity, medium-high for estimated effort.

### Phase Ordering Rationale

- Phase 1 comes before visual work because the research repeatedly identifies logic coupling and unclear task order as the root problem.
- Phase 2 follows Phase 1 because section scaffolding and CTA hierarchy depend on a stable view model and content decisions.
- Phase 3 waits until after structural refactor so the visual system lands on stable sections instead of frozen spaghetti JSX.
- Phase 4 is intentionally separate because the PLD preference bug and datetime inconsistencies are reliability work that deserves explicit planning and verification.
- Phase 5 is last because responsive tuning and regression coverage are most efficient once the redesigned surface and critical interaction paths stop moving.

### Research Flags

Phases likely needing deeper planning scrutiny:
- **Phase 1:** confirm where canonical session datetime should come from in current data contracts, because the research already surfaced conflicting field usage.
- **Phase 4:** confirm whether the PLD preference bug is purely client-state reconciliation or also requires backend validation/error-contract work.
- **Phase 5:** define the minimum regression strategy for a brownfield UI refresh, especially around student role behavior and preference save confirmation.

Phases with standard patterns and lower research risk:
- **Phase 2:** established React refactor pattern using selector extraction and presentational sections.
- **Phase 3:** standard dashboard hierarchy and copy simplification work within the current stack.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | High | Strong repo fit and clear signal that no migration is needed for this scope. |
| Features | High | The project brief and feature research align tightly on what launch should and should not include. |
| Architecture | High | The recommended refactor pattern matches both the current brownfield constraints and the design goals. |
| Pitfalls | High | The failure modes are concrete, relevant to the current dashboard, and map cleanly to phase design. |
| Phase ordering | Medium-High | Ordering is well-supported by research, but Phase 4 scope may shift slightly once the preference bug is reproduced in detail. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- The exact root cause of the current PLD preference error path still needs confirmation during planning or early execution.
- The canonical session time field needs explicit validation against the current dashboard data shape before implementation locks in copy and sorting behavior.
- The summary assumes the existing API contracts are sufficient; if Phase 4 finds a server-side validation gap, the roadmap may need a small backend subphase rather than a full backend redesign.

## Sources

### Primary
- `.planning/PROJECT.md` - project scope, active requirements, and constraints
- `.planning/research/STACK.md` - stack recommendation and brownfield fit
- `.planning/research/FEATURES.md` - MVP, anti-features, and launch priorities
- `.planning/research/ARCHITECTURE.md` - refactor shape, data flow, and build order
- `.planning/research/PITFALLS.md` - risk register and pitfall-to-phase mapping

### Supporting references cited by the research docs
- W3C WAI guidance on clear content, clear words, page structure, and cognitive accessibility
- Material Design guidance on cards, lists, and responsive layout

---
*Research completed: 2026-03-10*
*Ready for roadmap: yes*
