/* =========================================================
   AI Career Copilot — Learning Roadmap Generator
   Creates phased learning plans for target careers
   ========================================================= */
import DATA from './data.js';
import { recommendCourses } from './recommender.js';

/**
 * Generates a structured multi-phase learning roadmap.
 */
export function generateRoadmap(careerIds, userSkills, experience = 0) {
  const careers = DATA.careerPaths.filter(c => careerIds.includes(c.id));
  if (careers.length === 0) return null;

  const primary = careers[0];
  const courses = recommendCourses(careerIds, userSkills);
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));

  // Bucket skills into phases based on foundational vs advanced
  const missingRequired = primary.requiredSkills.filter(s => !userSet.has(s.toLowerCase()));
  const missingNice = (primary.niceToHave || []).filter(s => !userSet.has(s.toLowerCase()));

  // Phase durations based on experience
  const phaseMult = experience >= 3 ? 0.6 : experience >= 1 ? 0.8 : 1.0;

  const phases = [];

  /* Phase 1 – Foundation */
  const foundationSkills = missingRequired.slice(0, Math.ceil(missingRequired.length / 2));
  const foundationCourses = courses.filter(c => c.level === 'Beginner').slice(0, 3);
  if (foundationSkills.length > 0 || foundationCourses.length > 0) {
    phases.push({
      id: 'foundation',
      label: 'Phase 1',
      title: 'Foundations',
      color: '#0f62fe',
      duration: formatDuration(Math.round(4 * phaseMult)),
      description: 'Build the core skills and knowledge base required for this career path.',
      skills: foundationSkills,
      courses: foundationCourses.map(c => ({
        id: c.id,
        title: c.title,
        duration: c.duration,
        free: c.free,
        level: c.level,
        badge: c.badge,
      })),
      milestones: generateMilestones('foundation', primary.id, foundationSkills),
      completed: false,
    });
  }

  /* Phase 2 – Core Skills */
  const coreSkills = missingRequired.slice(Math.ceil(missingRequired.length / 2));
  const coreCourses = courses.filter(c => c.level === 'Intermediate').slice(0, 3);
  if (coreSkills.length > 0 || coreCourses.length > 0) {
    phases.push({
      id: 'core',
      label: 'Phase 2',
      title: 'Core Competencies',
      color: '#6929c4',
      duration: formatDuration(Math.round(6 * phaseMult)),
      description: 'Deepen your expertise in the primary skills for this career.',
      skills: coreSkills,
      courses: coreCourses.map(c => ({
        id: c.id,
        title: c.title,
        duration: c.duration,
        free: c.free,
        level: c.level,
        badge: c.badge,
      })),
      milestones: generateMilestones('core', primary.id, coreSkills),
      completed: false,
    });
  }

  /* Phase 3 – Advanced Skills */
  const advancedCourses = courses.filter(c => c.level === 'Advanced').slice(0, 2);
  if (missingNice.length > 0 || advancedCourses.length > 0) {
    phases.push({
      id: 'advanced',
      label: 'Phase 3',
      title: 'Advanced Specialization',
      color: '#007d79',
      duration: formatDuration(Math.round(8 * phaseMult)),
      description: 'Master advanced techniques and specialize in your focus area.',
      skills: missingNice.slice(0, 6),
      courses: advancedCourses.map(c => ({
        id: c.id,
        title: c.title,
        duration: c.duration,
        free: c.free,
        level: c.level,
        badge: c.badge,
      })),
      milestones: generateMilestones('advanced', primary.id, missingNice),
      completed: false,
    });
  }

  /* Phase 4 – Practice & Portfolio */
  phases.push({
    id: 'portfolio',
    label: 'Phase 4',
    title: 'Projects & Portfolio',
    color: '#198038',
    duration: formatDuration(Math.round(6 * phaseMult)),
    description: 'Apply your skills through real-world projects and build a portfolio that impresses employers.',
    skills: [],
    courses: [],
    milestones: getPortfolioMilestones(primary.id),
    completed: false,
  });

  /* Phase 5 – Job Search */
  phases.push({
    id: 'jobsearch',
    label: 'Phase 5',
    title: 'Job Application & Interview Prep',
    color: '#da1e28',
    duration: formatDuration(Math.round(4 * phaseMult)),
    description: 'Polish your resume, build your network, and prepare for technical and behavioral interviews.',
    skills: [],
    courses: [],
    milestones: [
      { id: 'js-1', text: 'Polish and optimize your resume', done: false },
      { id: 'js-2', text: 'Update LinkedIn profile with projects and skills', done: false },
      { id: 'js-3', text: 'Complete 5+ mock interviews in this app', done: false },
      { id: 'js-4', text: 'Apply to 20+ positions on LinkedIn/Indeed/company sites', done: false },
      { id: 'js-5', text: 'Prepare STAR-format answers for behavioral questions', done: false },
      { id: 'js-6', text: 'Network with 10+ professionals in your target industry', done: false },
    ],
    completed: false,
  });

  const totalWeeks = phases.reduce((sum, p) => {
    const match = p.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);

  return {
    careerTitle: primary.title,
    careerId: primary.id,
    phases,
    totalDuration: `${totalWeeks} weeks`,
    generatedAt: new Date().toISOString(),
  };
}

function generateMilestones(phase, careerId, skills) {
  const milestoneTemplates = {
    foundation: [
      'Complete an introductory online course',
      'Set up your development environment',
      'Build a simple "Hello World" project',
      'Read documentation for core tools',
    ],
    core: [
      'Complete a comprehensive intermediate course',
      'Implement a medium-complexity project',
      'Contribute to an open-source project',
      'Solve 20+ practice problems on LeetCode/HackerRank',
    ],
    advanced: [
      'Complete an advanced certification course',
      'Build a complex end-to-end project',
      'Write a technical blog post or tutorial',
      'Mentor a peer or participate in a study group',
    ],
  };

  const templates = milestoneTemplates[phase] || milestoneTemplates.core;
  const items = [];

  for (let i = 0; i < Math.min(skills.length, 3); i++) {
    items.push({ id: `${phase}-skill-${i}`, text: `Learn and practice: ${skills[i]}`, done: false });
  }

  templates.forEach((t, i) => {
    items.push({ id: `${phase}-ms-${i}`, text: t, done: false });
  });

  return items.slice(0, 6);
}

function getPortfolioMilestones(careerId) {
  const projects = {
    'data-scientist': [
      { id: 'p1', text: 'Build a machine learning model for a real-world dataset (Kaggle)', done: false },
      { id: 'p2', text: 'Create a data visualization dashboard with Tableau or Power BI', done: false },
      { id: 'p3', text: 'Complete the IBM Data Science Professional Certificate', done: false },
      { id: 'p4', text: 'Publish a data analysis notebook on GitHub', done: false },
    ],
    'ml-engineer': [
      { id: 'p1', text: 'Deploy an ML model as a REST API using Flask/FastAPI + Docker', done: false },
      { id: 'p2', text: 'Build an automated ML pipeline with feature store and model registry', done: false },
      { id: 'p3', text: 'Implement and compare 5+ ML algorithms from scratch', done: false },
      { id: 'p4', text: 'Contribute to an open-source ML library', done: false },
    ],
    'full-stack-dev': [
      { id: 'p1', text: 'Build a full-stack CRUD app with authentication (React + Node.js)', done: false },
      { id: 'p2', text: 'Create a portfolio website showcasing all your projects', done: false },
      { id: 'p3', text: 'Deploy an app to cloud with CI/CD pipeline', done: false },
      { id: 'p4', text: 'Contribute a feature or bug fix to an open-source project', done: false },
    ],
    default: [
      { id: 'p1', text: 'Complete a major capstone project in your domain', done: false },
      { id: 'p2', text: 'Publish your work on GitHub with clear documentation', done: false },
      { id: 'p3', text: 'Write a case study about your project on LinkedIn or Medium', done: false },
      { id: 'p4', text: 'Gather feedback and iterate on your project', done: false },
    ],
  };

  return projects[careerId] || projects.default;
}

function formatDuration(weeks) {
  if (weeks < 4) return `${weeks} weeks`;
  const months = Math.round(weeks / 4);
  return `${months} month${months > 1 ? 's' : ''}`;
}
