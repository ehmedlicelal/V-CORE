# Stack Research

**Domain:** Brownfield student dashboard UI refresh (React SPA + Express API)
**Researched:** 2026-03-10
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | repo: 19.2.0 | Existing view layer for the student dashboard refresh | Already established in the frontend, so the redesign can focus on hierarchy, component structure, and accessibility instead of migration work. |
| React Router | repo: 7.13.0 | Navigation between dashboard, sessions, announcements, and AI practice | Existing route model already supports the main student actions and keeps card CTAs straightforward. |
| Vite | repo: 7.2.4 | Local development and production builds | Current toolchain is fast enough for iterative UI work and does not need a build-system change for this pass. |
| Plain CSS with existing CSS variables | current app pattern | Layout, spacing, visual hierarchy, and responsive behavior | Best brownfield fit. The repo already uses global design tokens and page-level CSS, so the refresh can simplify the dashboard without introducing a second styling paradigm. |
| Express API | repo: 4.18.2 | Existing backend for sessions, announcements, and profile preference updates | The refresh is primarily presentational; keeping the current API contract avoids unnecessary backend churn. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | repo: 0.563.0 | Iconography for sessions, practice, status, and preferences | Reuse the existing icon set rather than adding another package or visual language. |
| clsx | optional if added | Conditional class composition | Add only if extracted dashboard components develop enough state variants that plain string concatenation becomes noisy. |
| date-fns | optional if added | Safer date and time formatting for session cards | Add only if date display rules become more complex than the current locale formatting and simple comparisons. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint | Keep JSX and hooks predictable during component cleanup | Favor readable component boundaries over clever abstractions. |
| Vite dev server | Fast iteration on layout and interaction changes | Existing HMR is sufficient for this redesign. |
| Browser responsive tooling | Validate card spacing and reflow at common widths | Check small-phone, tablet, and desktop layouts so sections reflow cleanly instead of only shrinking. |

## Guidance Applied to Stack Choices

- W3C cognitive accessibility guidance emphasizes clear words, short text blocks, whitespace, and separate, unambiguous instructions. For this dashboard, that supports native labels, brief helper copy, simple empty states, and fewer competing actions per section.
- Material card and responsive layout guidance emphasizes cards as entry points, consistent actions, restrained supplemental actions, and spacing that scales cleanly across breakpoints. For this refresh, that points toward a small set of repeatable session and action card patterns instead of a dense control surface.
- Combined, these sources favor a simple React plus CSS implementation with clear visual grouping over a component-heavy framework rollout.

## Installation

```bash
# Core
# No new core packages are required for this dashboard refresh.

# Optional lightweight helpers only if implementation pressure justifies them
npm install clsx
npm install date-fns
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Existing React + plain CSS | Large component framework such as MUI, Ant Design, or Chakra UI | Only if the team is starting a broader app-wide design system migration across multiple routes, not a single dashboard pass. |
| Existing CSS variables + page/component CSS files | Tailwind-first rewrite of the dashboard | Only if the team formally commits to a wider utility-first styling direction for the frontend. |
| Native semantic controls plus small helpers | Headless or primitives-heavy UI library | Use only if interaction complexity grows beyond simple cards, lists, buttons, dialogs, and form controls. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| A large component framework for this pass | It adds theme, token, override, and bundle overhead for one page and risks creating a second design language inside an existing plain-CSS app. | Keep the current React and CSS stack, then extract a few local dashboard components. |
| A dashboard-only styling migration | Mixing plain CSS with a one-off Tailwind or CSS-in-JS island raises maintenance cost and weakens consistency in a brownfield codebase. | Reuse existing CSS variables and page/component styles. |
| Dense cards with many inline actions | This conflicts with W3C clarity guidance and Material's guidance to limit supplemental actions on cards. | Use one primary action per card and, at most, one clearly subordinate secondary action. |

## Stack Patterns by Variant

**If the scope stays dashboard-only:**
- Keep the existing route and data flow, but split the page into a few focused presentational components.
- Continue using page-scoped CSS backed by shared variables from the current app.
- Put the highest-value tasks first in the scan order: active sessions, available sessions, AI practice, then lightweight preferences.

**If reuse expands across student-facing pages:**
- Extract neutral primitives such as `DashboardSection`, `SessionCard`, `ActionCard`, and `EmptyState`.
- Keep those primitives styling-light and CSS-based so they fit the rest of the frontend.

**If preference editing must remain lightweight:**
- Keep native `select`, `button`, helper text, and inline feedback.
- Avoid modal-heavy setup, multi-step flows, or advanced settings surfaces for PLD preferences.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| react@19.2.0 | react-dom@19.2.0 | Existing frontend pair; no change needed for the redesign. |
| react@19.2.0 | react-router-dom@7.13.0 | Existing routing stack already covers the dashboard navigation paths. |
| vite@7.2.4 | @vitejs/plugin-react@5.1.1 | Existing build pairing should remain unchanged for this pass. |
| Plain CSS + CSS variables | tailwindcss@4.1.18 (installed) | Can coexist in the repo, but should not be introduced into this screen unless the broader frontend direction changes. |

## Sources

- Repo inspection: `client/package.json`, `backend/package.json`, `client/src/pages/StudentDashboard.jsx`, `client/src/pages/StudentDashboard.css`, and `client/src/index.css`
- W3C WAI: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
- W3C WAI: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/
- W3C WAI: https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p05-succinct-text/
- W3C WAI: https://www.w3.org/TR/2021/NOTE-coga-usable-20210429/design_guide.html
- Material Design: https://m1.material.io/components/cards.html
- Material Design: https://m1.material.io/layout/responsive-ui.html

---
*Stack research for: Student Dashboard UI Refresh*
*Researched: 2026-03-10*
