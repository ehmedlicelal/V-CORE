# Feature Research

**Domain:** Student peer-learning dashboard refresh
**Researched:** 2026-03-10
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features students expect from a useful dashboard. Missing these makes the page feel noisy or incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear next-action card | Students open the dashboard to know what to do now, not to scan metrics. | MEDIUM | The first block should answer "Join a session", "Practice now", or "Nothing scheduled yet". Use plain verbs and short labels, in line with W3C clear wording guidance. |
| Upcoming and joinable sessions | Sessions are the core student task, so schedule visibility is table stakes. | MEDIUM | Promote the nearest session first, then list other joinable options below it. Show time, topic, and one obvious button. |
| Direct path to practice | When no session is happening, students still need a clear learning path. | LOW | Keep one persistent practice entry near the top. Treat it as the fallback primary action, not a side promotion. |
| Important announcements digest | Students need urgent changes and reminders without hunting through another page. | LOW | Show 1 to 3 short announcements with a view-all link. Keep message previews short and chunked. |
| Compact Peer Learning Day preference status | Existing preferences matter, but they are secondary to daily student actions. | LOW | Keep the current Peer Learning Day (PLD) slot visible, but collapse the full editor into a smaller supporting module or reveal-on-edit interaction. |
| Calm empty states | Students will often have no active session or no joinable session. | LOW | Empty states should always point to the next useful action, such as practice or updating availability. |

### Differentiators (Competitive Advantage)

Features that can make this dashboard feel calmer and more helpful than a generic student portal.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Personalized next-step message | Reduces decision fatigue by telling the student the best next move for today. | MEDIUM | Derive from active sessions, joinable sessions, and practice availability. Keep copy short, concrete, and non-judgmental. |
| Gentle progress cue | Gives momentum without turning the page into a KPI board. | LOW | Prefer soft signals such as "1 session this week" or "Practice resumed today" over grades or totals. |
| Pre-session context | Makes sessions easier to join and prepare for. | MEDIUM | Pair the next session with topic, start time, and one preparation hint instead of a separate detail-heavy card. |
| Low-pressure encouragement | Supports a calm tone and lowers anxiety for students returning after inactivity. | LOW | Use supportive microcopy such as "You can start with practice" instead of achievement language or streak pressure. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that may sound useful but would work against clarity-first redesign goals.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Dense stats row | Teams often want proof of activity, attendance, and grades at a glance. | It pulls attention away from the next action and makes the dashboard feel admin-facing. | Replace with one gentle progress cue or remove entirely from the top of the page. |
| Multiple competing hero cards | Every feature owner wants top placement. | Competing banners force students to re-decide where to focus on every visit. | Keep one top decision card, then one secondary practice path. |
| Jargon-heavy labels | Internal terms feel efficient to the team. | Students may not parse labels like "PLD" or "Active PLDs" quickly, especially when scanning. | Expand terms once and use plain labels like "Your next peer learning session". |
| Full preference form near the top | Preference editing exists today and may be seen as important setup. | A large form pushes time-sensitive session actions below the fold and adds cognitive load. | Show current preference in compact form with an "Edit" action. |
| Long announcement cards | Rich updates feel informative. | Large text blocks create a wall of reading and weaken the action hierarchy. | Show a short preview, date, and "View all announcements" link. |

## Feature Dependencies

```text
[Top next-action card]
    `--requires--> [Reliable session status and schedule data]
                       `--requires--> [Clear distinction between active, upcoming, and joinable sessions]

[Direct practice path] --enhances--> [Top next-action card]

[Compact announcements digest] --enhances--> [Student trust and awareness]

[Dense stats row] --conflicts--> [Calm, task-first dashboard hierarchy]

[Expanded preference editor] --conflicts--> [Sessions-first layout]
```

### Dependency Notes

- **Top next-action card requires reliable session status and schedule data:** the card cannot be trustworthy unless the dashboard can clearly tell whether a student should join now, prepare for later, or practice instead.
- **Reliable session status and schedule data requires a clear distinction between active, upcoming, and joinable sessions:** the redesign depends on better grouping rules than the current mixed list behavior.
- **Direct practice path enhances the top next-action card:** if no session is available, practice becomes the immediate fallback and prevents a dead-end dashboard.
- **Compact announcements digest enhances student trust and awareness:** short, visible updates reduce the need to search elsewhere for schedule changes or reminders.
- **Dense stats row conflicts with a calm, task-first dashboard hierarchy:** summary metrics compete with the actions students actually came to take.
- **Expanded preference editor conflicts with sessions-first layout:** setup controls are important, but they should not dominate the initial scan path.

## MVP Definition

### Launch With (v1)

Minimum viable product for the refresh should focus on clarity, obvious actions, and lower cognitive load.

- [ ] One top next-action area that chooses between join session, upcoming session, or practice now
- [ ] Sessions section that clearly separates "next" from "more available"
- [ ] Persistent practice entry point near the top of the page
- [ ] Compact announcement digest with short previews and a view-all path
- [ ] Compact Peer Learning Day preference summary with edit access
- [ ] Calm empty states that always point to the next useful action

### Add After Validation (v1.x)

Features to add once the simpler hierarchy proves useful.

- [ ] Personalized next-step messaging based on recent activity and schedule
- [ ] Gentle progress cue that does not look like an admin KPI
- [ ] Lightweight pre-session preparation hint attached to the next session

### Future Consideration (v2+)

Features to defer until the calmer dashboard pattern is established and validated.

- [ ] Adaptive recommendations across sessions and practice history, because this adds data and logic complexity
- [ ] Rich learning history or achievement views, because they risk reintroducing dashboard clutter if added too early

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Top next-action card | HIGH | MEDIUM | P1 |
| Upcoming and joinable sessions hierarchy | HIGH | MEDIUM | P1 |
| Direct practice path | HIGH | LOW | P1 |
| Compact announcements digest | MEDIUM | LOW | P1 |
| Compact Peer Learning Day preference status | MEDIUM | LOW | P1 |
| Personalized next-step message | HIGH | MEDIUM | P2 |
| Gentle progress cue | MEDIUM | LOW | P2 |
| Pre-session context hint | MEDIUM | MEDIUM | P2 |
| Rich learning history surface | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

Pattern comparison used for the redesign: current PLD dashboard vs. typical LMS dashboards.

| Feature | Competitor A | Competitor B | Our Approach |
|---------|--------------|--------------|--------------|
| Above-the-fold focus | Current PLD dashboard gives similar weight to stats, practice, preferences, announcements, and sessions. | Typical LMS dashboards often prioritize course administration, deadlines, or calendars. | Put one decision-oriented card first, then keep sessions and practice as the only dominant actions. |
| Session visibility | Current PLD dashboard shows active and future sessions, but the scan path is long and split by other modules. | Typical LMS dashboards usually bury peer sessions inside course or calendar views. | Make the nearest session obvious and keep other joinable sessions directly beneath it. |
| Practice entry | Current PLD dashboard promotes practice with a large banner, but it competes with several other emphasized blocks. | Practice-first apps usually keep one dominant continuation path. | Keep practice prominent, but as a clear secondary path when a session is not the top priority. |
| Preferences | Current PLD dashboard exposes a full-size preference editor high on the page. | Typical student portals place profile or preference controls in settings areas. | Preserve the preference function, but reduce it to a compact support module. |
| Language and density | Current PLD dashboard mixes product language, status labels, and multiple visual treatments. | Many dashboards use portal language that feels formal or admin-oriented. | Use plain wording, short descriptions, and chunked sections with strong separation. |

## Sources

- Current implementation review: `client/src/pages/StudentDashboard.jsx`
- Current implementation review: `client/src/pages/StudentDashboard.css`
- Project brief priorities: clarity first; layout and content redesign; only essentials visible; sessions and practice most prominent; PLD preferences retained but smaller; calm and simple tone
- W3C WAI supplemental guidance: "Use Clear Words" https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p01-clear-words/
- W3C WAI supplemental guidance: "Use Clear and Understandable Content" https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
- W3C WAI supplemental guidance: "Use White Spacing" https://www.w3.org/WAI/WCAG2/supplemental/patterns/o3p10-whitespace/
- W3C WAI supplemental guidance: "Use a Clear and Understandable Page Structure" https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/

---
*Feature research for: Student Dashboard UI Refresh*
*Researched: 2026-03-10*
