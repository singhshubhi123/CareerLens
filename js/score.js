/* =========================================================
   AI Career Copilot — Job Readiness Score Calculator
   ========================================================= */
import { getInterviewHistory } from './interview.js';

/**
 * Calculate the overall Job Readiness Score (0–100).
 * Composed of 5 weighted pillars.
 */
export function calculateReadinessScore(state) {
  const pillars = computePillars(state);
  const weights = { skills: 0.30, resume: 0.20, courses: 0.15, interview: 0.25, career: 0.10 };

  let total = 0;
  for (const [key, weight] of Object.entries(weights)) {
    total += (pillars[key]?.score || 0) * weight;
  }

  const score = Math.round(total);
  return {
    score,
    level: getScoreLevel(score),
    pillars,
    recommendations: generateRecommendations(score, pillars, state),
  };
}

function computePillars(state) {
  const profile = state.profile;
  const selectedCareers = state.selectedCareers || [];
  const completedCourses = state.completedCourses || [];
  const history = getInterviewHistory();

  // ------- SKILLS PILLAR -------
  let skillsScore = 0;
  if (profile) {
    const skillCount = profile.skills.length;
    skillsScore = Math.min(100, skillCount * 5 + (profile.experience || 0) * 8);
  }

  // ------- RESUME PILLAR -------
  const resumeScore = profile ? profile.resumeScore : 0;

  // ------- COURSES PILLAR -------
  const coursesScore = Math.min(100, completedCourses.length * 20);

  // ------- INTERVIEW PILLAR -------
  let interviewScore = 0;
  if (history.length > 0) {
    const avgScore = history.reduce((s, h) => s + (h.score?.avg || 0), 0) / history.length;
    interviewScore = Math.round(avgScore);
  }

  // ------- CAREER CLARITY PILLAR -------
  let careerScore = 0;
  if (selectedCareers.length > 0) careerScore += 40;
  if (state.roadmap) careerScore += 30;
  if (state.roadmap?.phases?.some(p => p.milestones?.some(m => m.done))) careerScore += 30;

  return {
    skills: {
      score: Math.round(Math.min(skillsScore, 100)),
      label: 'Skills Profile',
      icon: '⚡',
      color: '#6929c4',
      detail: profile ? `${profile.skills.length} skills identified` : 'No resume analyzed yet',
    },
    resume: {
      score: Math.round(resumeScore),
      label: 'Resume Quality',
      icon: '📄',
      color: '#0f62fe',
      detail: profile ? `${profile.wordCount} words, ${profile.education || 'unknown education'}` : 'No resume uploaded',
    },
    courses: {
      score: Math.round(coursesScore),
      label: 'Learning Progress',
      icon: '🎓',
      color: '#007d79',
      detail: `${completedCourses.length} course${completedCourses.length !== 1 ? 's' : ''} completed`,
    },
    interview: {
      score: Math.round(interviewScore),
      label: 'Interview Readiness',
      icon: '🎤',
      color: '#198038',
      detail: history.length > 0 ? `${history.length} session${history.length !== 1 ? 's' : ''} completed, avg ${Math.round(history.reduce((s, h) => s + (h.score?.avg || 0), 0) / history.length)}%` : 'No mock interviews yet',
    },
    career: {
      score: Math.round(Math.min(careerScore, 100)),
      label: 'Career Clarity',
      icon: '🧭',
      color: '#da1e28',
      detail: selectedCareers.length > 0 ? `${selectedCareers.length} career path(s) selected` : 'No career path chosen',
    },
  };
}

function getScoreLevel(score) {
  if (score >= 80) return { label: 'Job Ready! 🚀',    color: '#198038', tag: 'Excellent' };
  if (score >= 65) return { label: 'Almost There! 💪', color: '#007d79', tag: 'Good' };
  if (score >= 45) return { label: 'Building Up 📈',   color: '#f1c21b', tag: 'Fair' };
  if (score >= 25) return { label: 'Early Stage 🌱',   color: '#ff832b', tag: 'Needs Work' };
  return               { label: 'Just Starting 🎯',   color: '#da1e28', tag: 'Beginner' };
}

function generateRecommendations(score, pillars, state) {
  const recs = [];

  if (!state.profile) {
    recs.push({
      priority: 'high',
      title: 'Upload your resume',
      desc: 'Analyze your resume to identify skills and get personalized recommendations.',
      action: 'resume',
    });
  }

  if (pillars.skills.score < 50) {
    recs.push({
      priority: 'high',
      title: 'Expand your skill set',
      desc: 'Enroll in IBM SkillsBuild courses to fill skill gaps and increase your match score.',
      action: 'courses',
    });
  }

  if (pillars.resume.score < 60) {
    recs.push({
      priority: 'medium',
      title: 'Improve resume quality',
      desc: 'Add more skills, projects, and quantifiable achievements to your resume.',
      action: 'resume',
    });
  }

  if ((state.selectedCareers || []).length === 0) {
    recs.push({
      priority: 'high',
      title: 'Select a career path',
      desc: 'Choose your target career to unlock personalized learning roadmaps and course recommendations.',
      action: 'careers',
    });
  }

  if (pillars.interview.score < 60) {
    recs.push({
      priority: 'medium',
      title: 'Practice mock interviews',
      desc: 'Complete AI-powered mock interviews to improve your interview score and confidence.',
      action: 'interview',
    });
  }

  if (pillars.courses.score < 60) {
    recs.push({
      priority: 'medium',
      title: 'Complete IBM SkillsBuild courses',
      desc: `You have completed ${(state.completedCourses || []).length} courses. Aim for at least 5 to boost your score.`,
      action: 'courses',
    });
  }

  if (!state.roadmap) {
    recs.push({
      priority: 'low',
      title: 'Generate your learning roadmap',
      desc: 'Get a personalized week-by-week learning plan tailored to your target career.',
      action: 'roadmap',
    });
  }

  // Ensure we have at least one rec
  if (recs.length === 0) {
    recs.push({
      priority: 'low',
      title: 'Keep practicing and learning!',
      desc: 'You are on the right track. Continue completing courses, practicing interviews, and expanding your skill set.',
      action: 'courses',
    });
  }

  return recs.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  }).slice(0, 5);
}
