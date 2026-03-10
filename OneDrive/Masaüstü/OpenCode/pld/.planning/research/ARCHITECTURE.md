# Architecture Research

**Domain:** Brownfield React student dashboard refactor
**Researched:** 2026-03-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌──────────────────────────────── StudentDashboard Route ────────────────────────────────┐
│ StudentDashboard.jsx                                                                   │
│ - auth/redirect guard                                                                  │
│ - dashboard query orchestration                                                        │
│ - view-model derivation                                                                │
│ - section composition                                                                  │
├─────────────────────────────── Calm Dashboard Surface ──────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────────┐  ┌────────────────────┐                     │
│  │ HeroOverview   │  │ PrimaryActionCard  │  │ PreferencesCard    │                     │
│  │ next session   │  │ join or enter      │  │ PLD availability   │                     │
│  └────────┬───────┘  └──────────┬─────────┘  └──────────┬─────────┘                     │
│           │                     │                       │                               │
│  ┌────────▼────────┐  ┌─────────▼─────────┐  ┌─────────▼──────────┐                     │
│  │ OverviewStats   │  │ SecondarySection  │  │ UtilitySection     │                     │
│  │ 2-3 key metrics │  │ announcements     │  │ lightweight prefs  │                     │
│  └─────────────────┘  │ history/future    │  │ help/status        │                     │
│                       └───────────────────┘  └────────────────────┘                     │
├──────────────────────────────── Data + State Layer ─────────────────────────────────────┤
│ getSessions() | getJoinableSessions() | getAnnouncements() | joinSession()             │
│ local UI state: loading, expanded, savingPrefs, pldDay/pldTime                         │
│ derived selectors: activeSessions, nextJoinable, stats, announcementsPreview           │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `StudentDashboard` | Own page lifecycle, redirects, fetch orchestration, and section ordering | Existing route component remains the page entry and assembles smaller sections |
| `HeroOverview` | Present the page summary, next best action, and 2-3 supporting signals | Stateless section fed by derived data from the page view model |
| `PrimaryActionCard` | Show one clear CTA per card such as `Enter session`, `Join session`, or `Start practice` | Small presentational card with one primary button/link and brief supporting copy |
| `PreferencesCard` | Handle PLD availability changes without competing with session actions | Local form area with one save action and concise status feedback |
| `SecondarySection` | Hold announcements, future sessions, and optional history with progressive disclosure | Collapsible or stacked cards below the hero and primary actions |

## Recommended Project Structure

```text
client/
└── src/
    ├── api.js                              # Existing API contract stays unchanged
    └── pages/
        ├── StudentDashboard.jsx            # Route entry and top-level orchestration
        ├── StudentDashboard.css            # Page tokens, layout, and section styles
        └── student-dashboard/
            ├── sections/                   # Optional extracted presentational sections
            │   ├── HeroOverview.jsx
            │   ├── PrimaryActions.jsx
            │   ├── PreferencesCard.jsx
            │   └── SecondaryInfo.jsx
            └── selectors.js                # Pure derivation helpers from fetched arrays
```

### Structure Rationale

- **Keep `StudentDashboard.jsx` as the route boundary:** This avoids router churn and lets the refactor land incrementally in the existing page.
- **Co-locate extracted sections under `pages/student-dashboard/`:** This contains refactor scope to one feature area without forcing a global component reorganization.
- **Move derivation into `selectors.js` before major visual changes:** The current page mixes fetching, filtering, sorting, and rendering; separating derivation reduces layout risk.
- **Keep `StudentDashboard.css` as the styling entry point:** Existing imports stay stable while the visual system is replaced with calmer tokens and mobile-first section rules.

## Architectural Patterns

### Pattern 1: Page-Level View Model

**What:** Fetch the existing arrays once, then derive display-ready objects for hero, action cards, stats, and secondary lists in pure helpers.
**When to use:** Immediately. This is the safest first step in a brownfield page refactor.
**Trade-offs:** Adds an indirection layer, but it prevents UI branches from repeating date logic and student matching logic across sections.

**Example:**
```jsx
const dashboardModel = buildStudentDashboardModel({
  user,
  sessions,
  joinableSessions,
  announcements,
});

return (
  <>
    <HeroOverview hero={dashboardModel.hero} />
    <PrimaryActions actions={dashboardModel.primaryActions} />
    <PreferencesCard preferences={dashboardModel.preferences} />
    <SecondaryInfo sections={dashboardModel.secondarySections} />
  </>
);
```

### Pattern 2: One Primary Action Per Card

**What:** Each card exposes one dominant action and moves secondary details into supporting text, metadata, or a lower-priority link.
**When to use:** For active sessions, joinable sessions, AI practice, and preferences.
**Trade-offs:** Some dense information moves below the fold, but the page becomes calmer and decision-making becomes faster.

**Example:**
```jsx
<ActionCard
  title={session.groupName}
  summary={session.topicName}
  meta={sessionMeta}
  primaryAction={{ label: 'Enter session', to: `/session/${session.id}` }}
/>
```

### Pattern 3: Progressive Disclosure by Section Priority

**What:** Put hero and action sections first, keep utility/preferences lightweight, and push announcements/history/details lower with collapsible expansion only where needed.
**When to use:** For mobile layouts and for any section that is useful but not needed to complete the next task.
**Trade-offs:** Some users will need one extra tap for detail, but the first screen becomes easier to scan and aligns with W3C guidance on short blocks, clear headings, and reduced text density.

## Data Flow

### Request Flow

```text
[Page load]
    ↓
[StudentDashboard useEffect]
    ↓
[Promise.all(getSessions, getJoinableSessions, getAnnouncements)]
    ↓
[raw arrays in local state]
    ↓
[selectors.js builds dashboard model]
    ↓
[Hero / Actions / Preferences / Secondary sections render]
```

### State Management

```text
[server data state]
sessions | joinableSessions | announcements
    ↓
[derived page model]
hero | stats | primaryActions | preferencesStatus | secondarySections
    ↓
[presentational sections]

[local ui state]
loading | savingPrefs | expanded
    ↓
[interactive controls]
join action | save preferences | expand/collapse
```

### Key Data Flows

1. **Hero and overview flow:** `getSessions()` plus current user matching drive the hero summary, active session status, and small metric strip.
2. **Primary actions flow:** `activeSessions` and `joinableSessions` are normalized into ranked action cards so the page can surface one immediate task before showing secondary content.
3. **Preferences flow:** Existing profile save behavior remains independent of dashboard fetches; the refactor should improve placement and messaging, not change the endpoint contract.
4. **Announcements flow:** `getAnnouncements()` should remain a lightweight preview list on the dashboard, with full reading deferred to the dedicated announcements route.

## Build-Order Implications For An In-Place Refactor

1. **Stabilize logic first:** Extract `getMyData`, active session filtering, stat calculation, and announcement trimming into pure helpers before changing layout.
2. **Add semantic section wrappers next:** Introduce hero, primary actions, utility/preferences, and secondary info containers inside `StudentDashboard.jsx` while keeping existing content mostly intact.
3. **Replace visual hierarchy after structure exists:** Move from the current loud banner-first layout to calmer surfaces, clearer headings, and tighter copy once section boundaries are stable.
4. **Convert repeated card markup into presentational subcomponents:** Only after the layout is proven, extract small card components to reduce duplication.
5. **Apply progressive disclosure last:** Collapsible history or secondary details should be added after the primary path is already simple, otherwise the refactor can hide unresolved information architecture problems.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current brownfield scope | Keep local state in the page, preserve existing API calls, and focus on selector extraction plus section composition |
| More dashboard variants | Promote `selectors.js` and section components into a feature folder so role-specific dashboards can share derivation logic |
| Higher data volume | Add server-side summarization or narrower endpoints only if session/history payload size starts making first render slow |

### Scaling Priorities

1. **First bottleneck:** Cognitive load breaks before code scale. Too many competing banners and actions make the dashboard harder to use even when performance is acceptable.
2. **Second bottleneck:** Repeated derivation logic breaks maintainability. If each card sorts, filters, and formats data independently, visual changes become risky and slow.

## Anti-Patterns

### Anti-Pattern 1: Competing Hero Cards

**What people do:** Put welcome, stats, AI practice, preferences, announcements, and joinable sessions all in the first viewport as equal-weight cards.
**Why it's wrong:** The student cannot identify the next best action, and the page feels noisy rather than supportive.
**Do this instead:** Use one hero/overview area, then a primary actions section with one dominant action per card, followed by utility and secondary information.

### Anti-Pattern 2: Hiding Architecture Problems Behind Styling

**What people do:** Restyle the existing JSX without separating fetch logic, derived state, and section responsibilities.
**Why it's wrong:** The page keeps its brittle coupling, so later tweaks reintroduce layout regressions and inconsistent behavior.
**Do this instead:** Refactor the page model first, then redesign the UI on top of clearer data boundaries.

### Anti-Pattern 3: Rewriting Data Contracts During a UI Refresh

**What people do:** Change backend endpoints or invent new payloads during a dashboard redesign.
**Why it's wrong:** It expands scope from a page refactor into a product rewrite and makes verification harder.
**Do this instead:** Keep `getSessions`, `getJoinableSessions`, and `getAnnouncements` intact and adapt the UI with selector-level transformations.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `getSessions()` | Page-level fetch on load, then selector-driven derivation | Primary source for active sessions, stats, and completed-session history |
| `getJoinableSessions()` | Page-level fetch on load and after join | Best input for primary join actions and future-session cards |
| `getAnnouncements()` | Page-level fetch on load with dashboard preview trimming | Keep preview lightweight; route to full announcements page for detail |
| `joinSession()` | Card-level action handler followed by page refresh or targeted state update | Keep join CTA singular and explicit on each joinable card |
| `PUT /api/profile` | Utility area save action | Treat as a separate preferences workflow, not a hero-level CTA |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `StudentDashboard.jsx` ↔ `api.js` | Direct async calls | Keep this boundary stable during the redesign |
| `StudentDashboard.jsx` ↔ `selectors.js` | Pure function inputs/outputs | Main seam for reducing page complexity before visual changes |
| Page shell ↔ presentational sections | Props only | Sections should not fetch independently or duplicate sorting/filtering |
| Primary actions ↔ secondary information | Shared derived model, separate rendering priority | Keeps the first viewport focused while preserving access to details |

## Guidance Applied

- **W3C clarity guidance:** Use short, clear headings, concise supporting text, and small content blocks; avoid jargon-heavy labels and dense paragraphs in cards and utility panels.
- **W3C consistency guidance:** Keep labels, section order, and interaction patterns predictable across the dashboard so students do not relearn controls from card to card.
- **Material card/action guidance:** Treat each card as a container for one clear primary action; keep secondary actions limited and consistently placed.
- **Mobile-first grouping:** Stack hero, primary actions, utility/preferences, and secondary sections vertically on small screens before expanding into denser desktop arrangements.

## Sources

- W3C WAI, "Writing for Web Accessibility – Tips for Getting Started": https://www.w3.org/WAI/tips/writing/
- W3C WAI, "Use Clear and Understandable Content": https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
- W3C WAI, "Use Clear Words": https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/
- W3C WCAG 1.0 Guideline 14, "Ensure that documents are clear and simple": https://www.w3.org/TR/WCAG10/
- Material Design, "Cards - Components - Actions": https://m1.material.io/components/cards.html
- Material Design, "Lists - Components - Actions": https://m1.material.io/components/lists.html

---
*Architecture research for: Student Dashboard UI Refresh*
*Researched: 2026-03-10*
