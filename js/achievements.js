/* =========================================================
   CareerLens — Achievements Engine
   Badge definitions, XP rules, streak management
   ========================================================= */

/* ----------------------------------------------------------
   BADGE DEFINITIONS
   Each badge: { id, name, icon, xp, description, tier, category, condition }
   condition(state, interviewHistory) => boolean
---------------------------------------------------------- */
export const BADGES = [

  // ── Learning ────────────────────────────────────────────
  {
    id: 'first-course',
    name: 'First Step',
    icon: '📚',
    xp: 50,
    description: 'Complete your first IBM SkillsBuild course.',
    tier: 'bronze',
    category: 'learning',
    condition: (state) => (state.completedCourses?.length || 0) >= 1,
  },
  {
    id: 'five-courses',
    name: 'Bookworm',
    icon: '📖',
    xp: 150,
    description: 'Complete 5 IBM SkillsBuild courses.',
    tier: 'silver',
    category: 'learning',
    condition: (state) => (state.completedCourses?.length || 0) >= 5,
  },
  {
    id: 'ten-courses',
    name: 'Scholar',
    icon: '🎓',
    xp: 300,
    description: 'Complete 10 IBM SkillsBuild courses.',
    tier: 'gold',
    category: 'learning',
    condition: (state) => (state.completedCourses?.length || 0) >= 10,
  },
  {
    id: 'all-free',
    name: 'Free Learner',
    icon: '🆓',
    xp: 200,
    description: 'Complete all free IBM SkillsBuild courses.',
    tier: 'gold',
    category: 'learning',
    condition: (state) => {
      const freeIds = _getFreeCoursesIds();
      if (freeIds.length === 0) return false;
      return freeIds.every(id => (state.completedCourses || []).includes(id));
    },
  },

  // ── Interview ───────────────────────────────────────────
  {
    id: 'first-interview',
    name: 'First Interview',
    icon: '🎤',
    xp: 75,
    description: 'Complete your first mock interview session.',
    tier: 'bronze',
    category: 'interview',
    condition: (_state, history) => history.length >= 1,
  },
  {
    id: 'three-interviews',
    name: 'Practiced',
    icon: '💬',
    xp: 200,
    description: 'Complete 3 mock interview sessions.',
    tier: 'silver',
    category: 'interview',
    condition: (_state, history) => history.length >= 3,
  },
  {
    id: 'high-scorer',
    name: 'Top Performer',
    icon: '🏆',
    xp: 250,
    description: 'Score 80 or above in any mock interview session.',
    tier: 'gold',
    category: 'interview',
    condition: (_state, history) => history.some(s => (s.score?.avg || 0) >= 80),
  },
  {
    id: 'perfect-answer',
    name: 'Sharp Mind',
    icon: '🧠',
    xp: 100,
    description: 'Score 100 on a single answer in any session.',
    tier: 'silver',
    category: 'interview',
    condition: (_state, history) => history.some(s => (s.score?.best || 0) >= 100),
  },

  // ── Career ──────────────────────────────────────────────
  {
    id: 'first-career',
    name: 'Direction Set',
    icon: '🧭',
    xp: 50,
    description: 'Select your first career path.',
    tier: 'bronze',
    category: 'career',
    condition: (state) => (state.selectedCareers?.length || 0) >= 1,
  },
  {
    id: 'dual-career',
    name: 'Versatile',
    icon: '🌐',
    xp: 100,
    description: 'Select 2 career paths to explore.',
    tier: 'silver',
    category: 'career',
    condition: (state) => (state.selectedCareers?.length || 0) >= 2,
  },
  {
    id: 'roadmap-built',
    name: 'Roadmap Ready',
    icon: '🗺️',
    xp: 150,
    description: 'Generate your first personalized learning roadmap.',
    tier: 'silver',
    category: 'career',
    condition: (state) => !!state.roadmap,
  },

  // ── Profile ─────────────────────────────────────────────
  {
    id: 'resume-uploaded',
    name: 'First Impression',
    icon: '📄',
    xp: 50,
    description: 'Analyze your resume to extract skills and profile.',
    tier: 'bronze',
    category: 'profile',
    condition: (state) => !!state.profile,
  },
  {
    id: 'skill-rich',
    name: 'Well-Rounded',
    icon: '⚡',
    xp: 100,
    description: 'Have 15 or more skills detected from your resume.',
    tier: 'silver',
    category: 'profile',
    condition: (state) => (state.profile?.skills?.length || 0) >= 15,
  },
  {
    id: 'resume-master',
    name: 'Resume Master',
    icon: '🏅',
    xp: 150,
    description: 'Achieve a resume quality score of 80 or above.',
    tier: 'gold',
    category: 'profile',
    condition: (state) => (state.profile?.resumeScore || 0) >= 80,
  },

  // ── Streaks ─────────────────────────────────────────────
  {
    id: 'streak-3',
    name: 'On a Roll',
    icon: '🔥',
    xp: 75,
    description: 'Maintain a 3-day activity streak.',
    tier: 'bronze',
    category: 'streaks',
    condition: (state) => (state.streaks?.current || 0) >= 3,
  },
  {
    id: 'streak-7',
    name: 'Committed',
    icon: '🔥🔥',
    xp: 200,
    description: 'Maintain a 7-day activity streak.',
    tier: 'silver',
    category: 'streaks',
    condition: (state) => (state.streaks?.current || 0) >= 7,
  },
  {
    id: 'streak-14',
    name: 'Unstoppable',
    icon: '🔥🔥🔥',
    xp: 400,
    description: 'Maintain a 14-day activity streak.',
    tier: 'gold',
    category: 'streaks',
    condition: (state) => (state.streaks?.current || 0) >= 14,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    icon: '🌟',
    xp: 500,
    description: 'Earn 10 other badges — the ultimate achievement.',
    tier: 'legendary',
    category: 'streaks',
    condition: (state) =>
      (state.badges || []).filter(b => b.id !== 'completionist').length >= 10,
  },
];

/* ----------------------------------------------------------
   CATEGORY META — colors and labels for display
---------------------------------------------------------- */
export const CATEGORY_META = {
  learning:  { label: 'Learning',  color: 'var(--ibm-blue)',   tagClass: 'tag-blue'   },
  interview: { label: 'Interview', color: 'var(--ibm-purple)', tagClass: 'tag-purple' },
  career:    { label: 'Career',    color: 'var(--ibm-teal)',   tagClass: 'tag-teal'   },
  profile:   { label: 'Profile',   color: 'var(--ibm-green)',  tagClass: 'tag-green'  },
  streaks:   { label: 'Streaks',   color: 'var(--ibm-orange)', tagClass: 'tag-yellow' },
};

/* ----------------------------------------------------------
   TIER META — accent colors for badge cards
---------------------------------------------------------- */
export const TIER_COLORS = {
  bronze:    '#cd7f32',
  silver:    '#9e9e9e',
  gold:      '#f1c21b',
  legendary: '#6929c4',
};

/* ----------------------------------------------------------
   XP HELPERS
---------------------------------------------------------- */
const XP_PER_LEVEL = 500;

export function getTotalXP(state) {
  return state.xp || 0;
}

export function getLevel(xp) {
  return Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
}

export function getLevelProgress(xp) {
  return ((xp || 0) % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
}

export function getXPToNextLevel(xp) {
  return XP_PER_LEVEL - ((xp || 0) % XP_PER_LEVEL);
}

/* ----------------------------------------------------------
   INTERVIEW HISTORY HELPER
   Reads from localStorage key 'interviewHistory' directly
   to avoid circular dependency with pages/interview.js
---------------------------------------------------------- */
function _getInterviewHistory() {
  try {
    return JSON.parse(localStorage.getItem('interviewHistory') || '[]');
  } catch {
    return [];
  }
}

/* ----------------------------------------------------------
   FREE COURSE IDS HELPER
   Cache populated via primeFreeCoursesCache() called once
   at app boot before any evaluation.
---------------------------------------------------------- */
let _freeCourseIdsCache = null;

function _getFreeCoursesIds() {
  return _freeCourseIdsCache || [];
}

/** Call once at app boot to warm the free-course cache. */
export async function primeFreeCoursesCache() {
  if (_freeCourseIdsCache) return;
  try {
    const { default: DATA } = await import('./data.js');
    _freeCourseIdsCache = DATA.courses.filter(c => c.free).map(c => c.id);
  } catch {
    _freeCourseIdsCache = [];
  }
}

/* ----------------------------------------------------------
   STREAK UPDATE
   Call this from every action trigger point (NOT on app open).
   Returns true if streak was incremented.
---------------------------------------------------------- */
export function updateStreak(state) {
  if (!state.streaks) {
    state.streaks = { current: 0, longest: 0, lastActiveDate: null };
  }

  const today = _todayStr();
  const last = state.streaks.lastActiveDate;

  if (last === today) {
    // Already logged an action today — no change
    return false;
  }

  if (last === _yesterdayStr()) {
    // Consecutive day — increment streak
    state.streaks.current += 1;
  } else {
    // Gap or first ever — start at 1
    state.streaks.current = 1;
  }

  state.streaks.lastActiveDate = today;
  state.streaks.longest = Math.max(state.streaks.longest, state.streaks.current);
  return true;
}

/* ----------------------------------------------------------
   CORE EVALUATION
   Checks all badge conditions against current state.
   Awards newly unlocked badges and adds XP.
   Returns array of newly earned badge objects (for toasts).
---------------------------------------------------------- */
export function evaluateAchievements(state) {
  if (!Array.isArray(state.badges)) state.badges = [];
  if (typeof state.xp !== 'number') state.xp = 0;

  const earnedIds = new Set(state.badges.map(b => b.id));
  const history = _getInterviewHistory();
  const newlyEarned = [];

  for (const badge of BADGES) {
    if (earnedIds.has(badge.id)) continue; // already earned — skip

    let unlocked = false;
    try {
      unlocked = badge.condition(state, history);
    } catch {
      unlocked = false;
    }

    if (unlocked) {
      const earned = {
        id: badge.id,
        name: badge.name,
        icon: badge.icon,
        xp: badge.xp,
        category: badge.category,
        tier: badge.tier,
        earnedAt: new Date().toISOString(),
      };
      state.badges.push(earned);
      state.xp += badge.xp;
      earnedIds.add(badge.id); // prevent double-award in same evaluation pass
      newlyEarned.push(earned);
    }
  }

  return newlyEarned;
}

/* ----------------------------------------------------------
   PRIVATE DATE HELPERS
---------------------------------------------------------- */
function _todayStr() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function _yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
