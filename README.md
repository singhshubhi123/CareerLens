# 🎯 AI Career Copilot

**IBM SkillsBuild Hackathon Project** — An AI-powered career guidance platform for students.

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
4. Open `http://localhost:8080/ai-career-copilot/`

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📄 **Resume Analyzer** | Paste or upload resume text; AI extracts skills, experience, education, contacts |
| ⚡ **Skill Gap Analyzer** | Compares your skills vs. career requirements; shows critical gaps with radar chart |
| 🚀 **Career Path Recommender** | 8 AI-matched career paths ranked by skill compatibility; filterable grid |
| 🗺️ **Learning Roadmap** | 5-phase phased roadmap with milestones, course recommendations, timeline |
| 🎓 **IBM SkillsBuild Courses** | 15 curated courses ranked by your skill gaps; free/premium filter |
| 🤖 **Mock Interview** | AI-graded interview practice with 40+ questions across 8 careers |
| 📊 **Job Readiness Score** | Composite 0–100 score from 5 weighted pillars; action plan |

---

## 🏗️ Architecture

```
ai-career-copilot/
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
│   └── score.js            # Job Readiness Score calculator
└── pages/
    ├── dashboard.js        # Main dashboard with stats + quick actions
    ├── resume.js           # Resume upload/paste + results panel
    ├── skills.js           # Skill gap analysis + radar chart
    ├── careers.js          # Career path cards + detail modal
    ├── roadmap.js          # Timeline roadmap with milestone tracking
    ├── courses.js          # Filterable IBM SkillsBuild course grid
    ├── interview.js        # Live mock interview with timer + feedback
    └── score.js            # Score breakdown + personalized action plan
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

## 🎨 Design System

- **Framework**: IBM Carbon Design System (inspired)
- **Fonts**: IBM Plex Sans + IBM Plex Mono
- **Colors**: IBM Blue (#0f62fe), IBM Purple (#6929c4), IBM Teal (#007d79)
- **Layout**: Fixed sidebar + responsive main content
- **Components**: Cards, progress bars, radar charts (SVG), skill chips, toast notifications

---

## 💾 Data Persistence

All state is persisted to `localStorage` automatically:
- User profile (from resume analysis)
- Selected career paths
- Generated roadmap + milestone progress
- Completed courses
- Interview session history

---

## 🛠️ Tech Stack

- **Vanilla JavaScript** (ES2020+, ES Modules)
- **No dependencies** — zero npm packages, no bundler required
- **Native browser APIs**: localStorage, FileReader, Clipboard, CSS Custom Properties
- **SVG** for radar chart visualization

---

*Built for the IBM SkillsBuild Hackathon 2025*
