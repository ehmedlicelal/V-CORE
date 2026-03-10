# Pitfalls Research

**Domain:** Student dashboard refresh for the PLD web app
**Researched:** 2026-03-10
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Cognitive Overload From a Stats-First Dashboard

**What goes wrong:**
Students land on a screen that asks them to process welcome copy, summary stats, a promotional practice banner, preference controls, announcements, and session cards before the page answers the basic question: "What should I do next?" This raises cognitive load and makes the dashboard feel more like an admin overview than a student workspace.

**Why it happens:**
Brownfield refreshes often preserve every existing section and only restyle them. That keeps feature parity, but it ignores W3C clear-content guidance to make the page purpose obvious, keep structure understandable, and separate secondary content from the main task flow.

**How to avoid:**
Design the first viewport around the student's next action. Put the most time-sensitive session or practice action first, keep supporting context short, and push summary metrics into a quieter secondary zone or remove them from the default view.

**Warning signs:**
Students must scroll before they see their next session or best action. Section headings describe system buckets instead of student tasks. Review feedback includes "too much," "busy," or "I don't know where to start."

**Phase to address:**
Information hierarchy and content audit

---

### Pitfall 2: Too Many Competing CTAs

**What goes wrong:**
The dashboard presents several high-emphasis actions at once, such as entering a session, joining a future session, starting AI practice, saving PLD preferences, and opening announcements. When multiple controls compete visually, students hesitate, click the wrong thing, or ignore the task with the highest urgency.

**Why it happens:**
Each feature area is optimized in isolation. Buttons, banners, and links all receive strong styling because every section is treated as important. The result is a page with no clear priority system.

**How to avoid:**
Define a CTA hierarchy before final UI work. Allow one primary action per viewport area, use secondary styling for helpful but non-urgent utilities, and keep announcement browsing or preference editing visually quiet unless they require attention.

**Warning signs:**
More than one solid, high-contrast button appears above the fold. Stakeholders describe multiple sections as "the main thing." Students ask which action they are supposed to take first.

**Phase to address:**
CTA prioritization and component simplification

---

### Pitfall 3: Burying the Next Action Under Secondary Content

**What goes wrong:**
Urgent session actions appear below banners, stats, preferences, and announcements. Even when the right functionality exists, the page order hides the student's immediate next step behind lower-priority content.

**Why it happens:**
Teams often order sections by implementation history or data availability instead of student urgency. Labels such as "Active PLDs" also reflect internal product terminology rather than task language.

**How to avoid:**
Reorder the dashboard by urgency and frequency. Lead with the next session, joinable sessions, or practice action. Make empty states action-oriented, such as guiding students to practice or check for upcoming availability, instead of stopping at "none found."

**Warning signs:**
The main session card is below the fold on a standard laptop. Empty states do not suggest a next step. Students can describe the page contents but still cannot tell what to do next.

**Phase to address:**
Student journey and task-order redesign

---

### Pitfall 4: Keeping the Broken PLD Preference Interaction

**What goes wrong:**
The redesign ships with a calmer layout, but the known PLD preference path still throws errors or leaves students unsure whether their selection was actually saved. A simplified UI does not help if one of the few remaining utilities is still unreliable.

**Why it happens:**
Utility sections often become visually smaller during redesigns, which makes them easier to under-test. The current dashboard already has a known student-facing error in this interaction path, and the displayed "current preference" depends on user state that may not refresh after a save.

**How to avoid:**
Treat the preference path as a core regression target. Verify the full student flow: load existing preference, select a valid slot, save successfully, handle failure clearly, and immediately reflect the saved state in the UI. Test both valid and expired slot cases.

**Warning signs:**
The toast says save succeeded but the visible preference still shows the old value. Errors appear only in the console. The flow works in one role or page but not for students on the dashboard.

**Phase to address:**
PLD preference repair and regression testing

---

### Pitfall 5: Unclear or Inconsistent Time Information

**What goes wrong:**
Students see dates and times that are hard to trust or interpret. The current implementation already mixes time sources, uses fallback times, and marks expired options with logic that is not explained in plain language. This can cause missed sessions, mistaken availability choices, and support requests.

**Why it happens:**
Dashboard code often grows around multiple backend fields and local assumptions. In the current student dashboard, joinable session cards use `createdAt` for the displayed date while other logic relies on `scheduled_date`, and some UI falls back to a default time string.

**How to avoid:**
Define one canonical session datetime source for dashboard display logic. Show a clear absolute date and time, add a relative cue only if it helps, and state the timezone when relevant. Do not use fake fallback times for user-facing cards.

**Warning signs:**
The same session appears with different date or time values in different areas. A card shows `10:00 AM` because the data was missing. Students ask whether the time is local or whether a slot has already passed.

**Phase to address:**
Date/time normalization and copy refinement

---

### Pitfall 6: Responsive Regressions During Visual Simplification

**What goes wrong:**
The refreshed layout looks calmer on desktop but becomes harder to use on phones or narrow laptops. Priority actions move downward, buttons wrap awkwardly, and inline-styled blocks ignore the mobile rules applied elsewhere.

**Why it happens:**
Responsive behavior is fragile when the page mixes CSS classes with ad hoc inline styles, large desktop card treatments, and one large page component. Small "just for this block" changes escape the breakpoint system and create uneven mobile behavior.

**How to avoid:**
Treat mobile layout as part of the redesign, not polish after desktop approval. Move layout-affecting inline styles into shared classes, verify reading order and CTA visibility at narrow widths first, and keep card density low enough that the top action still appears early on small screens.

**Warning signs:**
Announcement cards or metadata rows feel cramped on 320 to 390 px widths. CTA labels wrap or overflow. Students see decorative surfaces before the action they need.

**Phase to address:**
Responsive implementation and cross-device QA

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline styles for announcement cards, loading states, and one-off layout tweaks | Fast local changes without touching shared CSS | Breakpoints, theming, and consistency drift apart; responsive fixes become piecemeal | Only during short-lived exploration, and remove before final merge |
| Keeping `StudentDashboard.jsx` as a large all-in-one page component | Faster shipping in one file | Harder to reason about priority, state coupling, and regressions; redesign changes become risky | Only while discovery is incomplete; split before final QA |
| Mixing session rules, time logic, and rendering in the same JSX file | Fewer abstractions up front | Time formatting, expired-slot logic, and CTA rules become hard to test and easy to duplicate | Never for finalized dashboard flows |
| Hardcoding PLD slot copy and fallback time values in the view | Quick way to render options | Stale rules, unclear copy, and inconsistent session times survive redesigns | Only if backed by shared constants and scheduled for near-term cleanup |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `AuthContext` plus profile save flow | Save succeeds but the dashboard still renders stale `user.pld_day` and `user.pld_time` values | Reconcile local state after save or refresh the user context immediately after a successful profile update |
| Sessions API data shaping | Displaying `createdAt` as the session date while filtering or hiding cards by `scheduled_date` | Build a single dashboard view model that normalizes the canonical session datetime once |
| Router and clickable banners | Making an entire banner clickable while also embedding a button-like control inside it | Use one semantic action target per card and preserve keyboard clarity |
| Toasts plus async refresh | Showing success toasts without updating the visible card state | Pair every success state with immediate UI reconciliation so the page never contradicts the toast |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Recomputing student-specific session data repeatedly during render | Sluggish interaction as session counts rise | Precompute a session-to-student map or derive memoized view data in a smaller container | Noticeable around 50 to 100 sessions per student view |
| Heavy gradients, shadows, and hover effects on every major card | Scroll jank and slower paint on lower-end devices | Use calmer surfaces, fewer layered effects, and reserve emphasis for one primary area | Most visible on mid-range mobile devices and older laptops |
| One large page rerendering for every expand, join, or save action | Unnecessary paint, harder-to-track state bugs, potential scroll jumps | Break the dashboard into smaller presentational sections with isolated state boundaries | Breaks as more widgets or announcements are added |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Relying on client-side role assumptions for student-only controls | Wrong users can hit error paths or see controls they should not use | Verify role gating in both UI tests and server contract behavior |
| Trusting client-side expired-slot logic as the only guard | Students can submit stale or invalid preference selections through crafted requests | Validate slot availability on the server or reject invalid saves explicitly |
| Assuming announcement or session copy will always stay plain text | Future rich-text additions could create unsafe rendering shortcuts | Keep content escaped by default and sanitize any formatted content before rendering |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Jargon such as "PLD" or "Active PLDs" without plain-language support | Students must translate product language before acting | Use a clearer label like "Peer learning time" or explain PLD in one short supporting line |
| Heavy stats with no immediate action | Attention goes to numbers that do not help students decide what to do next | Demote stats below the main action area or remove them from the default top section |
| Decorative intensity that overwhelms students | Bright gradients, badges, and motion compete with urgent tasks and raise stress | Use calmer surfaces and reserve strong contrast for one truly important action |
| Empty states that stop at "No sessions available" | Students hit a dead end | Pair empty states with a useful next step, such as practicing or checking later session availability |
| Feature-led section names instead of task-led wording | Students scan more slowly and infer the wrong priority | Name sections around intent, such as "Next session" or "Available to join" |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **First viewport:** Students can identify the next action within 5 seconds on both laptop and phone widths
- [ ] **PLD preference utility:** Student role can save, see the updated value immediately, and recover from save errors without console-only clues
- [ ] **Time display:** All session cards use the same canonical datetime source and never show a fake fallback time
- [ ] **CTA hierarchy:** Each viewport section has one visually dominant action at most
- [ ] **Plain-language copy:** Key labels avoid unexplained jargon or explain it in one short line
- [ ] **Responsive layout:** No overflow, clipped metadata, or hidden primary actions at 320 px, 390 px, and tablet widths
- [ ] **Empty states:** Every no-data state points students toward a useful next action

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Cognitive overload from too many top-level sections | MEDIUM | Strip the page back to the core student journey, remove one nonessential section at a time, then re-test first-task comprehension |
| Broken PLD preference interaction | HIGH | Reproduce the student path end to end, inspect request and response behavior, fix state sync or validation issues, and add a regression test before more styling work |
| Unclear or inconsistent time information | HIGH | Audit every time field in the dashboard pipeline, define one canonical formatter, and update all cards and slot labels together |
| Responsive regression after visual cleanup | MEDIUM | Test the narrowest width first, convert inline layout styles into CSS classes, and restore task-first reading order before reapplying polish |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Cognitive overload from a stats-first dashboard | Phase 1: Information hierarchy and content audit | A 5-second review shows students can name the page purpose and next action without scrolling |
| Too many competing CTAs | Phase 2: CTA prioritization and component simplification | Design review confirms one primary action per viewport area |
| Burying the next action | Phase 1: Student journey and task-order redesign | The next session or best action appears before secondary utilities on laptop and mobile |
| Keeping the broken PLD preference interaction | Phase 3: PLD preference repair and regression testing | Student save flow passes manually and through regression coverage |
| Unclear or inconsistent time information | Phase 3: Date/time normalization and copy refinement | The same session renders the same date and time across all dashboard states |
| Responsive regressions during simplification | Phase 4: Responsive implementation and cross-device QA | No overflow, hidden CTA, or broken reading order appears at target breakpoints |

## Sources

- Current project brief: `.planning/PROJECT.md`
- Current student dashboard implementation: `client/src/pages/StudentDashboard.jsx`
- Current student dashboard styles: `client/src/pages/StudentDashboard.css`
- W3C WAI, "Use Clear and Understandable Content": https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
- W3C WAI, "Use Clear Words": https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/
- W3C WAI, "Use a Clear and Understandable Page Structure": https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/
- W3C WAI, "Make the Purpose of Your Page Clear": https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p01-clear-purpose/
- Practical dashboard principles applied here: task-first hierarchy, one primary action per view, consistent time model, and mobile-first validation

---
*Pitfalls research for: Student Dashboard UI Refresh*
*Researched: 2026-03-10*
