# CareerLens — Progress Tracker with Streaks & Badges

## Top-Level Overview

Add a fully client-side, localStorage-backed gamification system to CareerLens. The system awards XP and unlocks badges as the user completes real actions (resume analysis, courses, interviews, career selection, roadmap generation). A new dedicated **Achievements** page in the sidebar shows all earned and locked badges, current XP total, and streak information. A compact **Achievements widget** on the dashboard gives an at-a-glance summary. All data lives in `state` (persisted via `careerLensState` in localStorage) — zero backend required.

---

## Architecture Decisions

- **New state fields added:** `state.xp`, `state.badges`, `state.streaks`
- **New file:** `js/achievements.js` — single source of truth for badge definitions, XP rules, and the evaluation engine
- **New page:** `pages/achievements.js` — the dedicated Achievements page
- **Trigger points:** Badge evaluation is called from the existing pages that already mutate relevant state (resume.js, courses.js, interview session complete, careers.js, roadmap.js)
- **No new CSS file needed** — uses existing `.tag`, `.card`, `.stat-card`, `.sidebar-badge`, and IBM color variables

---

## Badge Catalogue (18 badges across 5 categories)

### 🎓 Learning
| ID | Name | Condition | XP | Icon |
|----|------|-----------|-----|------|
| `first-course` | First Step | Complete 1 course | 50 | 📚 |
| `five-courses` | Bookworm | Complete 5 courses | 150 | 📖 |
| `ten-courses` | Scholar | Complete 10 courses | 300 | 🎓 |
| `all-free` | Free Learner | Complete all free courses | 200 | 🆓 |

### 🤖 Interview
| ID | Name | Condition | XP | Icon |
|----|------|-----------|-----|------|
| `first-interview` | First Interview | Complete 1 interview session | 75 | 🎤 |
| `three-interviews` | Practiced | Complete 3 interview sessions | 200 | 💬 |
| `high-scorer` | Top Performer | Score ≥ 80 in any session | 250 | 🏆 |
| `perfect-answer` | Sharp Mind | Score 100 on a single answer | 100 | 🧠 |

### 🚀 Career
| ID | Name | Condition | XP | Icon |
|----|------|-----------|-----|------|
| `first-career` | Direction Set | Select first career path | 50 | 🧭 |
| `dual-career` | Versatile | Select 2 career paths | 100 | 🌐 |
| `roadmap-built` | Roadmap Ready | Generate a learning roadmap | 150 | 🗺️ |

### 📄 Profile
| ID | Name | Condition | XP | Icon |
|----|------|-----------|-----|------|
| `resume-uploaded` | First Impression | Analyze a resume | 50 | 📄 |
| `skill-rich` | Well-Rounded | Detect 15+ skills | 100 | ⚡ |
| `resume-master` | Resume Master | Achieve resume score ≥ 80 | 150 | 🏅 |

### 🔥 Streaks
| ID | Name | Condition | XP | Icon |
|----|------|-----------|-----|------|
| `streak-3` | On a Roll | 3-day activity streak | 75 | 🔥 |
| `streak-7` | Committed | 7-day activity streak | 200 | 🔥🔥 |
| `streak-14` | Unstoppable | 14-day activity streak | 400 | 🔥🔥🔥 |
| `completionist` | Completionist | Earn 10 other badges | 500 | 🌟 |

---

## Streak Logic

- A "day of activity" = user completes a tracked action (course complete, interview session done, career selected, roadmap generated, resume analyzed) — NOT just opening the app
- Stored as `state.streaks = { current: number, longest: number, lastActiveDate: ISO date string }`
- `updateStreak(state)` is called from each trigger point (same places `evaluateAchievements` is called), NOT from `initApp()`

---

## XP System

- `state.xp = number` — cumulative total, never decreases
- Displayed as a level: every 500 XP = 1 level (Level 1 = 0–499 XP, Level 2 = 500–999 XP, etc.)
- No cap — keeps growing as user earns more badges

---

## Sub-Tasks

---

### Sub-Task 1 — Core Achievements Engine (`js/achievements.js`)

**Intent:** Create the single source of truth for all badge definitions, XP award logic, and streak management. This module is imported by trigger pages and the Achievements page — it must be self-contained with no circular dependencies.

**Expected Outcomes:**
- `js/achievements.js` exists and exports: `BADGES`, `evaluateAchievements(state)`, `updateStreak(state)`, `getTotalXP(state)`, `getLevel(xp)`, `getLevelProgress(xp)`
- `evaluateAchievements` checks all 18 badge conditions against current state, awards any newly unlocked badges (appended to `state.badges`), adds their XP to `state.xp`, and returns a list of newly-earned badge objects so callers can show a toast
- `updateStreak` compares today's date to `state.streaks.lastActiveDate` and increments/resets accordingly, then re-evaluates streak badges
- All badge data (id, name, icon, xp, description, condition function, tier) defined in a single `BADGES` array — conditions are pure functions that take `state` as argument

**Todo List:**
1. Create `js/achievements.js`
2. Define the `BADGES` array with all 18 entries — each entry: `{ id, name, icon, xp, description, tier, category, condition: (state, interviewHistory) => boolean }`
3. Implement `evaluateAchievements(state)` — iterates BADGES, skips already-earned ones (check `state.badges` array), awards new ones, mutates `state.xp` and `state.badges`, returns newly earned array
4. Implement `updateStreak(state)` — reads `state.streaks.lastActiveDate`, computes delta days, updates `state.streaks.current`, `state.streaks.longest`, `state.streaks.lastActiveDate`; then calls `evaluateAchievements` for streak badges
5. Implement `getTotalXP(state)`, `getLevel(xp)` (floor(xp/500) + 1), `getLevelProgress(xp)` (xp % 500 / 500 * 100)

**Relevant Context:**
- `state.badges` starts as `[]` (needs to be added to initial state in `js/app.js`)
- `state.xp` starts as `0`
- `state.streaks` starts as `{ current: 0, longest: 0, lastActiveDate: null }`
- Interview history is stored separately in `localStorage` under key `'interviewHistory'` — the condition function for interview badges must read this directly
- Badge condition for `completionist`: `state.badges.filter(b => b.id !== 'completionist').length >= 10` — fires when 10 other badges are earned, making it the 11th
- XP for a badge is only awarded once; re-evaluating a badge that's already in `state.badges` is a no-op

**Status:** `[x] done`

---

### Sub-Task 2 — Wire Trigger Points into Existing Pages

**Intent:** Call `evaluateAchievements(state)` and `saveState()` at the exact moment state changes in existing pages, so badges are awarded in real-time. Show a toast notification for each newly earned badge.

**Expected Outcomes:**
- After resume analysis completes → `resume-uploaded`, `skill-rich`, `resume-master` badges can fire
- After a course is marked complete → `first-course`, `five-courses`, `ten-courses`, `all-free` badges can fire
- After a career is selected → `first-career`, `dual-career` badges can fire
- After a roadmap is generated → `roadmap-built` badge can fire
- After an interview session completes → `first-interview`, `three-interviews`, `high-scorer`, `perfect-answer` badges can fire
- Each trigger shows a toast: `🏅 Badge Unlocked: {name} (+{xp} XP)` for each newly earned badge
- `updateStreak` is called once on app init in `js/app.js`

**Todo List:**
1. In `js/app.js`: add `xp: 0`, `badges: []`, `streaks: { current: 0, longest: 0, lastActiveDate: null }` to the initial `state` object; call `updateStreak(state)` inside `initApp()` after `loadState()`
2. In `pages/resume.js`: after `state.profile = result` and `saveState()`, call `evaluateAchievements(state)` and show a toast per new badge
3. In `pages/courses.js`: after `appState.completedCourses.push(id)` and `saveState()`, call `evaluateAchievements`
4. In `pages/careers.js`: after `appState.selectedCareers.push(careerId)` and `saveState()`, call `evaluateAchievements`
5. In `pages/roadmap.js`: find where `appState.roadmap` is set and `saveState()` is called, then call `evaluateAchievements`; check `js/app.js` `generateAndNavigate` function which sets `appState.roadmap`
6. In `pages/interview.js` (or `js/interview.js`): after a session is marked complete and saved, call `evaluateAchievements`

**Relevant Context:**
- Toast helper: `showToast(message, type, duration)` imported from `js/app.js`
- `saveState()` is already called in all these locations — just add `evaluateAchievements` call immediately after
- The roadmap is set inside `generateAndNavigate` in `pages/careers.js` (lines 261–268) — this is the right trigger point for `roadmap-built`
- Interview session completion happens in `js/interview.js` `completeSession()` function and in `pages/interview.js` — verify which one persists history before wiring

**Status:** `[ ] pending`

---

### Sub-Task 3 — Achievements Page (`pages/achievements.js`)

**Intent:** Build the full dedicated Achievements page, accessible from the sidebar, displaying XP level, streak, and all 18 badges (earned and locked) organized by category.

**Expected Outcomes:**
- Page renders with a hero section: current level (e.g. "Level 3"), XP progress bar toward next level, streak flame counter, total XP
- Badges displayed in category groups (Learning, Interview, Career, Profile, Streaks) using a responsive grid
- Earned badges: full color with earned date; locked badges: greyed-out with condition hint
- Stat row at top: Total XP | Badges Earned | Current Streak | Longest Streak
- Empty state handled gracefully if no badges earned yet (encouraging copy)

**Todo List:**
1. Create `pages/achievements.js` with `render(appState)` and `onMount(appState)` exports
2. Build the XP hero card: level number, XP progress bar (`progress-bar-wrap` + `progress-bar-fill`), next level threshold text
3. Build 4 stat cards (reuse `.stat-card` with `--accent-color`): Total XP, Badges Earned / 18, Current Streak, Longest Streak
4. Build badge grid by category — iterate `BADGES` grouped by `category`; for each badge render a `.card.card-sm` with: large emoji, name, XP value, earned/locked state, earned date if applicable
5. Earned badge card: full color accent, green `✓ Earned` tag, date badge; Locked badge: `filter: grayscale(1); opacity: 0.5`, locked icon overlay, condition hint text
6. Add a "Share Progress" section at the bottom with a text summary (copyable) — e.g. "I've earned 7/18 badges on CareerLens! 🏅"

**Relevant Context:**
- Import `BADGES`, `getTotalXP`, `getLevel`, `getLevelProgress` from `js/achievements.js`
- Card pattern: `.card` wrapper, `.card-header` + `.card-title`, `.card-sm` for compact cards
- Grid classes available: `grid grid-4` for stat row, `grid grid-auto` for badge grid
- Tag pattern for earned date: `<span class="tag tag-green">✓ Earned {date}</span>`
- IBM color variable per category: Learning → `--ibm-blue`, Interview → `--ibm-purple`, Career → `--ibm-teal`, Profile → `--ibm-green`, Streaks → `--ibm-orange`

**Status:** `[x] done`

---

### Sub-Task 4 — Register Route & Sidebar Entry

**Intent:** Wire the new Achievements page into the router and sidebar so it's navigable like every other page.

**Expected Outcomes:**
- `navigateTo('achievements')` loads the page
- Sidebar shows a new "🏅 Achievements" entry under a new "Progress" section label
- Sidebar shows a badge count (e.g. `3`) next to the entry using `.sidebar-badge`
- The badge count updates on re-render (reads from `state.badges.length` via a small inline script or by re-reading localStorage)

**Todo List:**
1. In `js/app.js` routes object, add: `achievements: () => import('../pages/achievements.js')`
2. In `index.html`, add a new `<p class="sidebar-section-label">Progress</p>` between the Learning and Practice sections, then add a `<div class="sidebar-item" data-page="achievements">` entry with a trophy SVG icon, the label "Achievements", and a `.sidebar-badge` span that will show badge count
3. Add a small inline update in `initApp()` (or on `navigateTo`) to refresh the sidebar badge count from `state.badges.length`

**Relevant Context:**
- Sidebar entries are in `index.html` lines 71–179
- Current section order: Main → Profile → Career → Learning → Practice
- New section "Progress" should sit between Learning (courses) and Practice (interview/score)
- The sidebar badge for courses is hardcoded as `30` — the achievements badge count should be dynamic; the simplest approach is to set it in `initApp()` and after each `evaluateAchievements` call: `document.getElementById('achievements-badge').textContent = state.badges.length`
- Routes object is at `js/app.js` lines 52–61

**Status:** `[x] done`

---

### Sub-Task 5 — Dashboard Achievements Widget

**Intent:** Add a compact Achievements summary widget to the dashboard so users see their progress without leaving the main screen.

**Expected Outcomes:**
- A new card on the dashboard (after the Quick Actions card) titled "🏅 Achievements & Streaks"
- Shows: current streak with flame icon, level badge, 3 most recently earned badges (or encouraging message if none), XP progress bar, and a "View All →" button linking to the achievements page
- Fits seamlessly with existing dashboard card style

**Todo List:**
1. In `pages/dashboard.js` `render()`, append a new achievements widget card HTML block after the Quick Actions section
2. Widget layout: header row (title + "View All →" button), then a flex row with streak pill + level pill + XP bar, then a row of up to 3 recently earned badge chips (`.tag` style) or empty-state text
3. In `pages/dashboard.js` `onMount()`, wire the "View All →" button to `navigateTo('achievements')`
4. Import `getTotalXP`, `getLevel`, `getLevelProgress` from `js/achievements.js` in `pages/dashboard.js`

**Relevant Context:**
- Import pattern already used in dashboard: `import('../js/recommender.js').then(...)` — use same dynamic import pattern or add static import at top
- Existing card pattern: `.card` > `.card-header` > `.card-title` + button; then content area
- Streak display: flame emoji + number + "day streak" in a pill like the welcome banner inline badges: `background:rgba(255,128,0,0.15); padding:6px 14px; border-radius:12px`
- Level display: `background:rgba(15,98,254,0.12)` blue pill
- Recently earned badges: map last 3 items of `state.badges` (reverse order) → `<span class="tag tag-${colorForCategory}">{icon} {name}</span>`

**Status:** `[x] done`

---

## Implementation Order

```
Sub-Task 1 (engine) → Sub-Task 2 (triggers) → Sub-Task 3 (page) → Sub-Task 4 (routing) → Sub-Task 5 (dashboard widget)
```

Sub-Tasks 3, 4, and 5 can be reviewed independently once 1 and 2 are done.
