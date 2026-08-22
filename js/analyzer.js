/* =========================================================
   AI Career Copilot — Resume Analyzer
   Extracts skills, experience, and education from text
   ========================================================= */
import DATA from './data.js';

/* All recognizable skills (flat list) */
const ALL_SKILLS = Object.values(DATA.skillCategories)
  .flatMap(cat => cat.skills);

/* Keyword → normalized skill name for fuzzy matching */
const SKILL_ALIASES = {
  'js': 'JavaScript', 'ts': 'TypeScript', 'py': 'Python',
  'node': 'Node.js', 'nodejs': 'Node.js',
  'react.js': 'React', 'reactjs': 'React',
  'vue': 'Vue.js', 'vuejs': 'Vue.js',
  'angular.js': 'Angular', 'angularjs': 'Angular',
  'ml': 'Machine Learning', 'ai': 'Machine Learning',
  'deep learning': 'Deep Learning', 'dl': 'Deep Learning',
  'tf': 'TensorFlow', 'tensorflow2': 'TensorFlow',
  'pytorch': 'PyTorch', 'torch': 'PyTorch',
  'k8s': 'Kubernetes', 'kube': 'Kubernetes',
  'aws': 'AWS', 'amazon web services': 'AWS',
  'gcp': 'Google Cloud', 'google cloud platform': 'Google Cloud',
  'azure': 'Azure', 'microsoft azure': 'Azure',
  'linux': 'Linux', 'unix': 'Linux',
  'ci/cd': 'CI/CD', 'cicd': 'CI/CD',
  'rest': 'REST APIs', 'rest api': 'REST APIs',
  'agile': 'Agile/Scrum', 'scrum': 'Agile/Scrum',
  'nlp': 'NLP', 'natural language processing': 'NLP',
  'cv': 'Computer Vision', 'computer vision': 'Computer Vision',
  'ux': 'UI/UX Design', 'ui/ux': 'UI/UX Design',
  'figma': 'Figma',
  'postgres': 'PostgreSQL', 'psql': 'PostgreSQL',
  'mongo': 'MongoDB', 'mongodb': 'MongoDB',
  'mysql': 'MySQL',
  'pandas': 'Pandas', 'numpy': 'NumPy',
  'sklearn': 'Scikit-learn', 'scikit': 'Scikit-learn',
};

/**
 * Extract detected skills from raw resume text.
 * Returns an array of unique skill strings.
 */
export function extractSkills(text) {
  if (!text || text.trim().length === 0) return [];

  const lower = text.toLowerCase();
  const found = new Set();

  // Direct match against all known skills
  for (const skill of ALL_SKILLS) {
    if (lower.includes(skill.toLowerCase())) {
      found.add(skill);
    }
  }

  // Alias match
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    if (lower.includes(alias.toLowerCase())) {
      found.add(canonical);
    }
  }

  return [...found];
}

/**
 * Extract years of experience from text.
 * Looks for patterns like "3 years of experience", "5+ years"
 */
export function extractExperience(text) {
  if (!text) return 0;
  const patterns = [
    /(\d+)\s*\+?\s*years?\s+(?:of\s+)?(?:work\s+)?experience/i,
    /experience[:\s]+(\d+)\s*\+?\s*years?/i,
    /(\d+)\s*-\s*\d+\s*years?\s+of\s+experience/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseInt(match[1], 10);
  }
  // Count job title sections as proxy
  const jobIndicators = (text.match(/\b(engineer|developer|analyst|scientist|designer|manager|intern)\b/gi) || []).length;
  return Math.max(0, jobIndicators - 1);
}

/**
 * Extract education level from text.
 */
export function extractEducation(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower.includes('phd') || lower.includes('ph.d') || lower.includes('doctorate')) return 'PhD';
  if (lower.includes('master') || lower.includes('m.s.') || lower.includes('mba') || lower.includes('m.tech')) return "Master's";
  if (lower.includes('bachelor') || lower.includes('b.s.') || lower.includes('b.e.') || lower.includes('b.tech') || lower.includes('undergraduate')) return "Bachelor's";
  if (lower.includes('associate') || lower.includes('diploma')) return 'Associate / Diploma';
  return 'High School / Other';
}

/**
 * Extract contact info heuristically.
 */
export function extractContact(text) {
  if (!text) return {};
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  const linkedInMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  return {
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0].trim() : null,
    linkedin: linkedInMatch ? linkedInMatch[0] : null,
    github: githubMatch ? githubMatch[0] : null,
  };
}

/**
 * Extract a name (first line heuristic).
 */
export function extractName(text) {
  if (!text) return 'Student';
  const firstLine = text.trim().split('\n')[0].trim();
  // If the first line is short and looks like a name
  if (firstLine.length < 50 && /^[A-Za-z\s.'-]+$/.test(firstLine)) {
    return firstLine;
  }
  return 'Student';
}

/**
 * Full resume analysis: returns a structured profile object.
 */
export function analyzeResume(text) {
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  const contact = extractContact(text);
  const name = extractName(text);

  // Categorize detected skills
  const skillsByCategory = {};
  for (const [catKey, catData] of Object.entries(DATA.skillCategories)) {
    const matched = catData.skills.filter(s => skills.includes(s));
    if (matched.length > 0) {
      skillsByCategory[catKey] = { label: catData.label, skills: matched };
    }
  }

  // Compute a completeness score 0–100
  const resumeScore = computeResumeCompleteness(text, skills, experience, education, contact);

  return {
    name,
    contact,
    skills,
    skillsByCategory,
    experience,
    education,
    resumeScore,
    wordCount: text.trim().split(/\s+/).length,
    analyzedAt: new Date().toISOString(),
  };
}

function computeResumeCompleteness(text, skills, experience, education, contact) {
  let score = 0;
  if (contact.email) score += 10;
  if (contact.phone) score += 5;
  if (contact.linkedin) score += 8;
  if (contact.github) score += 7;
  if (education) score += 10;
  score += Math.min(skills.length * 2, 30); // up to 30 for skills
  score += Math.min(experience * 3, 20);    // up to 20 for experience
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount > 200) score += 5;
  if (wordCount > 400) score += 5;
  return Math.min(score, 100);
}

/**
 * Demo resume text for first-time users.
 */
export const DEMO_RESUME = `John Smith
john.smith@email.com | +1-555-0123 | linkedin.com/in/johnsmith | github.com/johnsmith

EDUCATION
Bachelor's in Computer Science, Stanford University (2021)

EXPERIENCE
Software Engineering Intern — Google (2020)
- Developed Python scripts to automate data pipelines, improving efficiency by 40%
- Built REST APIs using Flask and deployed on Google Cloud
- Collaborated in Agile/Scrum environment with a team of 8 engineers

Data Science Intern — IBM (2021)
- Analyzed datasets with Pandas and NumPy to extract business insights
- Built machine learning models using Scikit-learn (classification accuracy: 94%)
- Created interactive dashboards using Tableau and SQL queries

SKILLS
Python, JavaScript, React, SQL, Machine Learning, TensorFlow, Docker, Git, 
Communication, Problem Solving, Teamwork, AWS, Node.js, HTML/CSS

PROJECTS
- Resume Analyzer: NLP-based app to extract skills from resumes using Python
- E-Commerce Platform: Full-stack app with React, Node.js, MongoDB`;
