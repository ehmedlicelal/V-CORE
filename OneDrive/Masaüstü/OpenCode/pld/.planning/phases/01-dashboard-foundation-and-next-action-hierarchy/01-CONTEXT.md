# Phase 1: Dashboard Foundation and Next-Action Hierarchy - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 reshapes the top of the student dashboard around one clear next action, keeps AI practice available as the fallback action, removes stats-first clutter, and defines calm empty states. It does not redesign detailed session workflows, announcements behavior, or PLD preference reliability fixes from later phases.

</domain>

<decisions>
## Implementation Decisions

### Top Focus
- The top of the dashboard should be a single next-action card, not a separate welcome hero or a sessions-neutral overview.
- If there is no urgent session, the top action should push the student toward AI practice.
- Welcome copy should stay very short and live inside the main next-action card instead of in a separate banner.
- AI practice should remain visible as a secondary card directly below the top action when it is not the main next step.

### Content Trim
- Remove the current top stats row instead of shrinking or moving it lower in Phase 1.
- Fold any greeting into the main next-action card rather than keeping a standalone welcome banner.
- Keep very little visual competition near the top of the page: one primary card and one quieter secondary card.
- The first screen should feel airy and quiet, with more whitespace and less decorative intensity than the current dashboard.

### Empty States
- When there is no urgent session, the primary empty-state action should direct the student to practice now.
- Empty-state copy should be reassuring and direct, not hype-driven or overly minimal.
- If there are no joinable sessions, the dashboard should show a helpful placeholder instead of hiding the section entirely.
- Empty states should use a simple card with one icon and short copy rather than large illustrations or dense text.

### Claude's Discretion
- Exact microcopy for the next-action card, practice card, and empty states.
- Exact spacing, icon choice, and visual treatment needed to achieve the airy, quiet tone within the existing CSS system.
- Exact ordering of supporting sections below the top action area, as long as it preserves the primary/secondary hierarchy decided above.

</decisions>

<specifics>
## Specific Ideas

- The current first screen feels busy because `client/src/pages/StudentDashboard.jsx` stacks a welcome banner, a stats row, and a large practice banner before the main workflow.
- The redesign should feel student-friendly by being calm and simple, not by adding more promotional energy.
- Practice should stay easy to reach, but it should not compete with the main next-action decision when a session is more urgent.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `client/src/pages/StudentDashboard.jsx`: already fetches sessions, joinable sessions, and announcements, and contains the current next-action competition that this phase will simplify.
- `client/src/pages/StudentDashboard.css`: existing page-scoped styling surface where the hierarchy and density changes can land without introducing a new UI framework.
- `client/src/context/ToastContext.jsx`: existing feedback pattern available if Phase 1 needs lightweight user guidance or non-blocking notices.
- `client/src/components/Layout.jsx`: existing application shell that already controls the page frame, so Phase 1 can stay focused on dashboard content order rather than global layout changes.

### Established Patterns
- Page-level state and derived view logic currently live directly inside `client/src/pages/StudentDashboard.jsx` using `useState` and `useEffect`.
- Styling is handled with colocated plain CSS plus some inline styles, so Phase 1 should stay within page-scoped CSS rather than introducing a new styling system.
- Navigation uses `react-router-dom` with direct `navigate('/practice')` and `Link` usage, which makes the top action and secondary practice card straightforward to wire into existing routes.

### Integration Points
- `getSessions`, `getJoinableSessions`, and `getAnnouncements` from `client/src/api.js` already provide the data inputs that shape the next-action hierarchy.
- `useAuth()` supplies the student identity and current PLD values that inform greeting text and supporting dashboard context.
- The `/practice` route already exists as the fallback learning action, so Phase 1 only needs to position it correctly in the dashboard hierarchy.

</code_context>

<deferred>
## Deferred Ideas

None - discussion stayed within Phase 1 scope.

</deferred>

---

*Phase: 01-dashboard-foundation-and-next-action-hierarchy*
*Context gathered: 2026-03-10*
