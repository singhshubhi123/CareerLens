/* =========================================================
   AI Career Copilot — Mock Interview Engine
   Manages interview sessions and AI feedback scoring
   ========================================================= */
import DATA from './data.js';

/**
 * Start a new interview session.
 * @param {string} careerId    - target career (e.g. 'data-scientist')
 * @param {number} count       - number of questions (3, 5, or 10)
 * @param {string} type        - 'mixed' | 'technical' | 'behavioral'
 * @param {boolean} timedMode  - auto-advance when question timer runs out
 * @returns {InterviewSession}
 */
export function startSession(careerId, count = 5, type = 'mixed', timedMode = false) {
  const careerQuestions = DATA.interviewQuestions[careerId] || [];
  const generalQuestions = DATA.interviewQuestions.general || [];

  // Behavioral topics (general pool only – career Qs are always technical)
  const behavioralTopics = ['Behavioral', 'Career Goals', 'Teamwork'];

  let pool;
  if (type === 'behavioral') {
    // Only behavioral questions from general pool
    pool = generalQuestions.filter(q => behavioralTopics.includes(q.topic));
    // Pad with all general if not enough
    if (pool.length < count) pool = [...generalQuestions];
  } else if (type === 'technical') {
    // Only career-specific questions (no general behavioral)
    pool = [...careerQuestions];
    if (pool.length < count) pool = [...careerQuestions, ...generalQuestions.filter(q => !behavioralTopics.includes(q.topic))];
  } else {
    // Mixed: 70% career-specific + 30% general
    const careerCount = Math.min(Math.ceil(count * 0.7), careerQuestions.length);
    const generalCount = count - careerCount;
    const shuffledCareer = shuffle([...careerQuestions]).slice(0, careerCount);
    const shuffledGeneral = shuffle([...generalQuestions]).slice(0, generalCount);
    pool = [...shuffledCareer, ...shuffledGeneral];
  }

  const questions = shuffle([...pool]).slice(0, count);

  return {
    id: `session-${Date.now()}`,
    careerId,
    type,
    timedMode,
    questions,
    answers: new Array(questions.length).fill(''),
    feedbacks: new Array(questions.length).fill(null),
    bookmarks: new Array(questions.length).fill(false),
    currentIndex: 0,
    startedAt: Date.now(),
    endedAt: null,
    completed: false,
  };
}

/**
 * AI-simulate answer evaluation.
 * In a real deployment this would call a backend LLM endpoint.
 * Here we use a deterministic heuristic scoring system.
 */
export function evaluateAnswer(question, answer, careerId) {
  if (!answer || answer.trim().length < 10) {
    return {
      overallScore: 0,
      criteria: {
        relevance: 0, depth: 0, clarity: 0, examples: 0, structure: 0,
      },
      feedback: 'No answer provided.',
      suggestions: ['Try to provide a detailed answer with specific examples.'],
      keywords: [],
    };
  }

  const text = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).length;

  // Relevance: does the answer mention keywords from the question?
  const qWords = question.q.toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const keywordHits = qWords.filter(w => text.includes(w)).length;
  const relevance = Math.min(100, Math.round((keywordHits / Math.max(qWords.length, 1)) * 100) + 20);

  // Depth: word count heuristic
  let depth = 0;
  if (wordCount >= 250) depth = 90;
  else if (wordCount >= 150) depth = 75;
  else if (wordCount >= 80) depth = 55;
  else if (wordCount >= 40) depth = 35;
  else depth = 15;

  // Clarity: punctuation, sentence structure
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLen = wordCount / Math.max(sentences.length, 1);
  let clarity = 70;
  if (avgSentenceLen > 30) clarity -= 15; // too long sentences
  if (avgSentenceLen < 5) clarity -= 10;  // too short/fragmented
  if (answer.includes(',') && sentences.length > 2) clarity += 10;
  clarity = Math.max(0, Math.min(100, clarity));

  // Examples: does it mention concrete examples?
  const exampleKeywords = ['for example','for instance','such as','like','e.g.','specifically','in my project','i used','i built','i implemented','at my company','when i'];
  const hasExamples = exampleKeywords.some(k => text.includes(k));
  const examples = hasExamples ? Math.min(90, 55 + Math.floor(Math.random() * 25)) : Math.min(40, 15 + Math.floor(Math.random() * 20));

  // Structure: STAR keywords or numbered lists
  const structureKeywords = ['first','second','third','finally','in conclusion','to summarize','situation','task','action','result','because','therefore','however'];
  const structureHits = structureKeywords.filter(k => text.includes(k)).length;
  const structure = Math.min(100, 40 + structureHits * 10);

  const overallScore = Math.round(
    relevance * 0.25 + depth * 0.20 + clarity * 0.20 + examples * 0.20 + structure * 0.15
  );

  // Generate feedback text
  const feedback = generateFeedback(overallScore, relevance, depth, clarity, examples, structure, question);
  const suggestions = generateSuggestions(relevance, depth, examples, structure, question);

  // Detected keywords from the answer
  const detectedKeywords = detectKeywords(answer, careerId);

  return {
    overallScore,
    criteria: { relevance, depth, clarity, examples, structure },
    feedback,
    suggestions,
    keywords: detectedKeywords,
  };
}

function generateFeedback(score, relevance, depth, clarity, examples, structure, question) {
  if (score >= 80) {
    return `Excellent answer! You demonstrated strong understanding of the topic with good depth and relevant examples. ${question.tips ? 'Great alignment with best practices.' : ''}`;
  } else if (score >= 65) {
    return `Good answer with solid content. You covered the main points, but could benefit from more specific examples and a clearer structure. Consider using the STAR method for behavioral questions.`;
  } else if (score >= 45) {
    return `Your answer touches on the right concepts but lacks depth. Expand on your points with concrete examples from your experience and ensure you directly address the question asked.`;
  } else {
    return `The answer needs more development. Focus on directly answering the question, providing specific technical details, and sharing relevant examples from your projects or experience.`;
  }
}

function generateSuggestions(relevance, depth, examples, structure, question) {
  const suggestions = [];
  if (relevance < 60) suggestions.push('Make sure to address the specific question asked — stay on topic.');
  if (depth < 50) suggestions.push('Add more depth: expand your answer with technical details and nuanced points.');
  if (examples < 50) suggestions.push(`Use the STAR method or add concrete examples: "${question.tips || 'share a specific project or scenario'}"`);
  if (structure < 50) suggestions.push('Improve structure: use clear signposting like "First...", "Then...", "Finally..."');
  if (suggestions.length === 0) suggestions.push('Strong answer — consider quantifying your impact where possible (e.g., "reduced latency by 40%").');
  return suggestions.slice(0, 3);
}

function detectKeywords(answer, careerId) {
  const careerKeywordMap = {
    'data-scientist': ['machine learning','model','data','features','training','accuracy','overfitting','cross-validation','neural'],
    'ml-engineer': ['pipeline','deployment','serving','monitoring','drift','kubernetes','docker','inference','production'],
    'full-stack-dev': ['react','node','api','database','authentication','component','state','async','promise'],
    'cloud-architect': ['availability','scalability','load balancer','region','vpc','iam','cost','redundancy'],
    'cybersecurity': ['vulnerability','threat','attack','encryption','authentication','firewall','incident','malware'],
    'devops-engineer': ['ci/cd','pipeline','container','deployment','monitoring','automation','infrastructure','rollback'],
    'ux-designer': ['user research','wireframe','prototype','accessibility','persona','usability','journey map'],
    'product-manager': ['roadmap','stakeholder','priority','metrics','sprint','backlog','user story','okr'],
    general: ['experience','project','team','result','challenge','solution','learning','impact'],
  };

  const keywords = [...(careerKeywordMap[careerId] || []), ...careerKeywordMap.general];
  const lower = answer.toLowerCase();
  return keywords.filter(kw => lower.includes(kw));
}

/**
 * Compute aggregate session score from all answered questions.
 */
export function computeSessionScore(session) {
  const answered = session.feedbacks.filter(f => f !== null && f.overallScore > 0);
  if (answered.length === 0) return { avg: 0, answered: 0, total: session.questions.length };
  const avg = Math.round(answered.reduce((s, f) => s + f.overallScore, 0) / answered.length);
  return { avg, answered: answered.length, total: session.questions.length };
}

/**
 * Get interview history from localStorage.
 */
export function getInterviewHistory() {
  try {
    return JSON.parse(localStorage.getItem('interviewHistory') || '[]');
  } catch {
    return [];
  }
}

/**
 * Save a completed session to history.
 */
export function saveSession(session) {
  const history = getInterviewHistory();
  const sessionScore = computeSessionScore(session);
  // Include best single-answer score for the 'perfect-answer' badge
  const answered = session.feedbacks.filter(f => f !== null && f.overallScore > 0);
  const best = answered.length > 0 ? Math.max(...answered.map(f => f.overallScore)) : 0;
  const summary = {
    id: session.id,
    careerId: session.careerId,
    type: session.type || 'mixed',
    date: new Date().toISOString(),
    score: { ...sessionScore, best },
    questionCount: session.questions.length,
  };
  history.unshift(summary);
  localStorage.setItem('interviewHistory', JSON.stringify(history.slice(0, 20)));
}

/**
 * Toggle bookmark for a question index.
 */
export function toggleBookmark(session, idx) {
  if (!session.bookmarks) session.bookmarks = new Array(session.questions.length).fill(false);
  session.bookmarks[idx] = !session.bookmarks[idx];
}

/**
 * Generate a structured sample answer framework from the question's metadata.
 * Fully client-side — no backend required.
 */
export function generateSampleAnswer(question) {
  const isBehavioral = ['Behavioral', 'Career Goals', 'Teamwork'].includes(question.topic);
  const tips = question.tips || '';

  // Parse tips into bullet points split by '. ' or '. '
  const tipPoints = tips
    .split(/(?<=[.!])\s+/)
    .map(s => s.replace(/\.$/, '').trim())
    .filter(s => s.length > 10);

  if (isBehavioral) {
    return {
      framework: 'STAR Method',
      description: 'Structure behavioral answers using Situation → Task → Action → Result.',
      sections: [
        { label: 'Situation', hint: 'Set the scene — describe the context and challenge you faced.' },
        { label: 'Task', hint: 'Explain your specific responsibility or what was expected of you.' },
        { label: 'Action', hint: `Describe the steps you took. ${tipPoints[0] || ''}` },
        { label: 'Result', hint: 'Share the outcome — quantify impact where possible (%, time saved, etc.).' },
      ],
      tips: tipPoints,
    };
  }

  // Technical questions: use a 3-part framework
  return {
    framework: 'Define → Explain → Example',
    description: 'Strong technical answers cover the concept, its mechanics, and a real-world application.',
    sections: [
      { label: 'Define', hint: 'Start with a clear, concise definition of the core concept.' },
      { label: 'Explain', hint: `Cover the key mechanics or tradeoffs. ${tipPoints[0] || ''}` },
      { label: 'Example / Application', hint: `Ground it in a real scenario or project. ${tipPoints[1] || 'Mention a specific tool, system, or experience you have used.'}` },
    ],
    tips: tipPoints,
  };
}

/* Utility */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
