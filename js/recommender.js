/* =========================================================
   AI Career Copilot — Career & Course Recommender
   Matches user skills to career paths and courses
   ========================================================= */
import DATA from './data.js';

/**
 * Score a career path against the user's skill set.
 * Returns a match percentage 0–100.
 */
function scoreCareer(career, userSkills) {
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));
  const required = career.requiredSkills;
  const nice = career.niceToHave || [];

  let score = 0;
  let requiredMatched = 0;

  for (const skill of required) {
    if (userSet.has(skill.toLowerCase())) {
      score += 10;
      requiredMatched++;
    }
  }

  for (const skill of nice) {
    if (userSet.has(skill.toLowerCase())) {
      score += 4;
    }
  }

  const maxScore = required.length * 10 + nice.length * 4;
  const rawPct = maxScore > 0 ? (score / maxScore) * 100 : 0;

  // Boost slightly for required coverage
  const requiredCoverage = required.length > 0 ? (requiredMatched / required.length) : 0;
  const boosted = rawPct * 0.7 + requiredCoverage * 30;

  return Math.round(Math.min(boosted, 100));
}

/**
 * Get skill gaps for a specific career.
 * Returns { missing: [], partial: [] }
 */
export function getSkillGaps(career, userSkills) {
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));
  return {
    missing: career.requiredSkills.filter(s => !userSet.has(s.toLowerCase())),
    niceToHave: (career.niceToHave || []).filter(s => !userSet.has(s.toLowerCase())),
    covered: career.requiredSkills.filter(s => userSet.has(s.toLowerCase())),
  };
}

/**
 * Recommend career paths sorted by match score.
 * Returns top careers with scores and gap info.
 */
export function recommendCareers(userSkills) {
  return DATA.careerPaths
    .map(career => ({
      ...career,
      matchScore: scoreCareer(career, userSkills),
      gaps: getSkillGaps(career, userSkills),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Recommend courses for a specific career path,
 * prioritizing courses that cover skill gaps.
 */
export function recommendCourses(careerIds, userSkills) {
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));

  return DATA.courses
    .map(course => {
      // How many of the course's skills are missing from user profile
      const newSkills = course.skills.filter(s => !userSet.has(s.toLowerCase()));
      // Does this course relate to one of the target careers?
      const careerRelevance = course.careers
        ? course.careers.filter(c => careerIds.includes(c)).length
        : 0;

      const relevanceScore =
        newSkills.length * 5          // bonus for gap-filling
        + careerRelevance * 15        // bonus for career match
        + (course.free ? 3 : 0)       // bonus for free courses
        + (course.rating - 4.0) * 10; // rating bonus

      return { ...course, newSkills, relevanceScore, careerRelevance };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get all unique skills from a list of career paths.
 */
export function getAllRequiredSkills(careerIds) {
  const careers = DATA.careerPaths.filter(c => careerIds.includes(c.id));
  const skillSet = new Set();
  for (const career of careers) {
    career.requiredSkills.forEach(s => skillSet.add(s));
    (career.niceToHave || []).forEach(s => skillSet.add(s));
  }
  return [...skillSet];
}

/**
 * Compute the per-skill proficiency score relative to career requirements.
 * Returns array of { skill, userHas, importance } sorted by importance.
 */
export function computeSkillMatrix(careerIds, userSkills) {
  const careers = DATA.careerPaths.filter(c => careerIds.includes(c.id));
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));
  const skillMap = {};

  for (const career of careers) {
    for (const skill of career.requiredSkills) {
      const key = skill.toLowerCase();
      if (!skillMap[key]) skillMap[key] = { skill, requiredBy: 0, niceBy: 0 };
      skillMap[key].requiredBy++;
    }
    for (const skill of (career.niceToHave || [])) {
      const key = skill.toLowerCase();
      if (!skillMap[key]) skillMap[key] = { skill, requiredBy: 0, niceBy: 0 };
      skillMap[key].niceBy++;
    }
  }

  return Object.values(skillMap)
    .map(entry => ({
      ...entry,
      userHas: userSet.has(entry.skill.toLowerCase()),
      importance: entry.requiredBy * 10 + entry.niceBy * 4,
    }))
    .sort((a, b) => b.importance - a.importance);
}
