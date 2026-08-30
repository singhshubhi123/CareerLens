# 🔍 CareerLens

**See your career clearly.** — An AI-powered career guidance platform built on IBM SkillsBuild.

---

## 🚀 Quick Start

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. No build step required — it uses native ES Modules
3. For best experience, serve from a local web server:
   ```bash
   # Python
   python -m http.server 8080

   # Node.js
   npx serve .

   # VS Code
   Use the "Live Server" extension
   ```
4. Open `http://localhost:8080/careerlens/`

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📄 **Resume Analyzer** | Paste or upload resume text; AI extracts skills, experience, education, contacts |
| ⚡ **Skill Gap Analyzer** | Compares your skills vs. career requirements; shows critical gaps with radar chart |
| 🚀 **Career Path Recommender** | 20+ AI-matched career paths ranked by skill compatibility; filterable grid |
| 🗺️ **Learning Roadmap** | 5-phase phased roadmap with milestones, course recommendations, timeline |
| 🎓 **IBM SkillsBuild Courses** | 30+ curated courses ranked by your skill gaps; free/premium filter |
| 🤖 **Mock Interview** | AI-graded interview practice with 50+ questions across 12+ careers |
| 📊 **Job Readiness Score** | Composite 0–100 score from 5 weighted pillars; action plan |
| 🏅 **Achievements** | 18 badges across 5 categories; XP levelling system; daily streaks |
| ✏️ **Resume Builder** | ATS-optimised resume wizard with live preview; PDF & DOCX download |

---

## 🏗️ Architecture

```
careerlens/
├── index.html              # App shell, layout, router bootstrap
├── css/
│   ├── main.css            # IBM Carbon-inspired design system
│   └── components.css      # Feature-specific component styles
├── js/
│   ├── app.js              # State management, router, shared utilities
│   ├── data.js             # Career data, skills taxonomy, courses catalog
│   ├── analyzer.js         # Resume text parser (skill extraction engine)
│   ├── recommender.js      # Career + course scoring algorithm
│   ├── roadmap.js          # Learning roadmap generator
│   ├── interview.js        # Interview session + AI answer evaluator
│   ├── score.js            # Job Readiness Score calculator
│   └── achievements.js     # Badges, XP, streaks engine
└── pages/
    ├── dashboard.js        # Main dashboard with stats + quick actions
    ├── resume.js           # Resume upload/paste + results panel
    ├── skills.js           # Skill gap analysis + radar chart
    ├── careers.js          # Career path cards + detail modal
    ├── roadmap.js          # Timeline roadmap with milestone tracking
    ├── courses.js          # Filterable IBM SkillsBuild course grid
    ├── interview.js        # Live mock interview with timer + feedback
    ├── score.js            # Score breakdown + personalized action plan
    ├── achievements.js     # XP level, badge collection, streak display
    └── resume-builder.js   # Multi-step resume wizard + live preview
```

---

## 🧠 AI Scoring Methodology

### Resume Analysis
- Regex + keyword matching across 100+ skills in 8 categories
- Alias normalization (e.g. "JS" → JavaScript, "k8s" → Kubernetes)
- Contact, education, and experience extraction

### Career Match Score
- **Required skills** match: 10 pts/skill
- **Nice-to-have** match: 4 pts/skill
- Required coverage bonus: max 30 pts
- Normalized to 0–100%

### Answer Evaluation (Mock Interview)
Weighted across 5 dimensions:
- **Relevance** (25%) — keyword overlap with question
- **Depth** (20%) — word count heuristic
- **Clarity** (20%) — sentence structure
- **Examples** (20%) — STAR indicators
- **Structure** (15%) — signposting words

### Job Readiness Score (5 pillars)
| Pillar | Weight |
|--------|--------|
| Skills Profile | 30% |
| Resume Quality | 20% |
| Learning Progress | 15% |
| Interview Readiness | 25% |
| Career Clarity | 10% |

---

## 🏅 Achievements System

- **18 badges** across 5 categories: Learning, Interview, Career, Profile, Streaks
- **XP levels** — every 500 XP advances one level; XP is earned by completing real actions
- **Daily streaks** — increments only when a meaningful action is completed on a new calendar day
- **Longest streak** tracking persisted to localStorage

---

## 🤖 Mock Interview Enhancements

New features added on top of the core interview engine:

| Feature | Description |
|---------|-------------|
| **Question type filter** | Filter questions by Behavioural, Technical, or Situational |
| **Word target** | Guided word-count target per answer for better depth scoring |
| **Retry question** | Re-attempt any question within the same session |
| **Sample answer reveal** | View a model answer after submitting your own |
| **Session summary screen** | Full breakdown of scores and feedback at end of session |
| **Bookmark question** | Save questions for later review |
| **Progress bar** | Visual completion indicator across the session |
| **Timed practice mode** | Optional countdown timer per question |
| **Comparative session history** | Compare scores across past sessions |

---

## ✏️ Resume Builder

A full multi-step wizard that generates an ATS-friendly resume with a live side-by-side preview:

| Step | Fields |
|------|--------|
| **Contact** | Name, email, phone, location, LinkedIn, GitHub |
| **Summary** | Professional summary / objective |
| **Experience** | Title, company, dates, bullet points (add/remove entries) |
| **Education** | Degree, field, institution, year, GPA |
| **Skills** | Skill chip manager (auto-seeded from Resume Analyzer) |
| **Projects** | Name, URL, tech stack, description |

**Additional capabilities:**
- 🎯 **ATS Compatibility Score** — live score with actionable tips as you fill the form
- 📄 **Download PDF** — print-ready A4 layout generated in-browser
- 📝 **Download DOCX** — Word-compatible export
- 💾 **Auto-save draft** — builder state persists to localStorage
- Profile seed — contact details and skills are pre-filled from a completed Resume Analyzer session

---

## 🎨 Design System

- **Framework**: IBM Carbon Design System (inspired)
- **Fonts**: IBM Plex Sans + IBM Plex Mono
- **Colors**: IBM Blue (#0f62fe), IBM Purple (#6929c4), IBM Teal (#007d79)
- **Layout**: Fixed sidebar + responsive main content
- **Components**: Cards, progress bars, radar charts (SVG), skill chips, toast notifications, wizard step progress, modal overlays

---

## 💾 Data Persistence

All state is persisted to `localStorage` automatically:
- User profile (from resume analysis)
- Selected career paths
- Generated roadmap + milestone progress
- Completed courses
- Interview session history + bookmarked questions
- Resume builder draft
- Earned badges, XP, and streak data

---

## 🛠️ Tech Stack

- **Vanilla JavaScript** (ES2020+, ES Modules)
- **No runtime dependencies** — zero npm packages required for production
- **Native browser APIs**: localStorage, FileReader, Clipboard, CSS Custom Properties, `window.print()` for PDF
- **SVG** for radar chart visualization
- **Vite** (optional dev server for hot-reload during development)

---

## 📋 Changelog

| Commit | Changes |
|--------|---------|
| `a4e0683` | Resume Builder page — multi-step wizard, live preview, ATS score, PDF/DOCX export; app icon updated |
| `9d37140` | 10+ new career paths; 10+ new courses; interview questions for new paths; Achievements system (badges, XP, streaks); project rebranded to CareerLens |
| `715d1d3` | Interview enhancements — question type filter, word target, retry, sample answers, session summary, bookmarks, progress bar, timed mode, session history |
| `29f24bb` | Fix resume upload/parsing regression |
| `2a67d58` | Fix PDF resume upload and parsing |
| `3c9fe31` | Initial commit — AI Career Copilot |

---

*CareerLens — Built for the IBM SkillsBuild Hackathon 2025*
