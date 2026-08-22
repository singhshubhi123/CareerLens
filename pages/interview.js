/* =========================================================
   Mock Interview Page
   ========================================================= */
import { navigateTo, saveState, showToast, el } from '../js/app.js';
import { startSession, evaluateAnswer, computeSessionScore, saveSession } from '../js/interview.js';
import DATA from '../js/data.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });

  // If no session active, show setup screen
  if (!appState.interviewSession) {
    container.innerHTML = renderSetupScreen(appState);
  } else {
    container.innerHTML = renderInterviewScreen(appState.interviewSession, appState);
  }

  return container;
}

export function onMount(appState) {
  if (!appState.interviewSession) {
    mountSetup(appState);
  } else {
    mountInterview(appState);
  }
}

/* =========================================================
   SETUP SCREEN
   ========================================================= */
function renderSetupScreen(appState) {
  const careerOptions = DATA.careerPaths.map(c => `
    <option value="${c.id}" ${appState.selectedCareers.includes(c.id) ? 'selected' : ''}>
      ${c.emoji} ${c.title}
    </option>
  `).join('');

  return `
    <div class="page-header">
      <h1>🤖 AI Mock Interview</h1>
      <p>Practice real interview questions with instant AI feedback on your answers. Improve your score with every session.</p>
    </div>

    <div style="max-width:600px">
      <!-- Setup Card -->
      <div class="card card-lg mb-5">
        <div class="card-header">
          <div class="card-title">🎯 Configure Your Interview</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="career-select">Target Career Role</label>
          <select class="form-select" id="career-select">
            ${careerOptions}
          </select>
          <span class="form-helper">Questions will be tailored to this role</span>
        </div>

        <div class="form-group">
          <label class="form-label">Number of Questions</label>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap" id="q-count-btns">
            ${[3,5,10].map(n => `
              <button class="btn ${n === 5 ? 'btn-primary' : 'btn-secondary'} q-count-btn" data-count="${n}">
                ${n} Questions ${n === 5 ? '(Recommended)' : n === 3 ? '(Quick)' : '(Full)'}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Interview Type</label>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <label class="form-check">
              <input type="radio" name="interview-type" value="mixed" checked> Mixed (Technical + Behavioral)
            </label>
            <label class="form-check">
              <input type="radio" name="interview-type" value="technical"> Technical Only
            </label>
            <label class="form-check">
              <input type="radio" name="interview-type" value="behavioral"> Behavioral Only
            </label>
          </div>
        </div>

        <button class="btn btn-primary btn-lg w-full" id="start-interview-btn">
          🎤 Start Interview Session
        </button>
      </div>

      <!-- Tips Card -->
      <div class="card mb-5">
        <div class="card-header">
          <div class="card-title">💡 Interview Tips</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;font-size:0.875rem">
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>📝</span>
            <div><strong>Use the STAR method</strong> for behavioral questions: Situation, Task, Action, Result</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>⏱️</span>
            <div><strong>Aim for 2-3 minute answers</strong> — detailed enough to show expertise, concise enough to stay on point</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>🎯</span>
            <div><strong>Be specific</strong> — use concrete examples, metrics, and outcomes from your experience</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>🔄</span>
            <div><strong>Practice multiple times</strong> — each session improves your score and fluency</div>
          </div>
        </div>
      </div>

      <!-- Past Sessions -->
      <div id="past-sessions-wrap"></div>
    </div>
  `;
}

function mountSetup(appState) {
  let selectedCount = 5;

  document.querySelectorAll('.q-count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.q-count-btn').forEach(b => b.className = 'btn btn-secondary q-count-btn');
      btn.className = 'btn btn-primary q-count-btn';
      selectedCount = parseInt(btn.dataset.count);
    });
  });

  document.getElementById('start-interview-btn')?.addEventListener('click', () => {
    const careerId = document.getElementById('career-select')?.value || 'data-scientist';
    appState.interviewSession = startSession(careerId, selectedCount);
    navigateTo('interview');
  });

  // Load past sessions
  import('../js/interview.js').then(({ getInterviewHistory }) => {
    const history = getInterviewHistory();
    const wrap = document.getElementById('past-sessions-wrap');
    if (!wrap || history.length === 0) return;
    wrap.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📜 Past Sessions</div>
        </div>
        ${history.map(h => {
          const career = DATA.careerPaths.find(c => c.id === h.careerId);
          return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid var(--ui-03);font-size:0.875rem">
              <div>
                <div style="font-weight:500">${career?.emoji || '🤖'} ${career?.title || h.careerId}</div>
                <div style="color:var(--text-secondary);font-size:0.75rem">${new Date(h.date).toLocaleDateString()} · ${h.questionCount} questions</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.25rem;font-weight:700;color:${h.score?.avg >= 70 ? 'var(--ibm-green)' : h.score?.avg >= 50 ? 'var(--ibm-orange)' : 'var(--ibm-red)'}">
                  ${h.score?.avg || 0}%
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  });
}

/* =========================================================
   INTERVIEW SCREEN
   ========================================================= */
function renderInterviewScreen(session, appState) {
  const q = session.questions[session.currentIndex];
  const qNum = session.currentIndex + 1;
  const total = session.questions.length;
  const existingAnswer = session.answers[session.currentIndex] || '';

  return `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div>
          <h1>🤖 Mock Interview</h1>
          <p>Question ${qNum} of ${total} · ${DATA.careerPaths.find(c => c.id === session.careerId)?.title || session.careerId}</p>
        </div>
        <div style="display:flex;gap:0.75rem;align-items:center">
          <div class="interview-timer" id="session-timer">00:00</div>
          <button class="btn btn-secondary btn-sm" id="end-session-btn">End Session</button>
        </div>
      </div>
    </div>

    <div class="interview-arena">
      <!-- Main Column -->
      <div class="interview-main">
        <!-- Question -->
        <div class="question-card">
          <div class="question-number">Question ${qNum} of ${total}</div>
          <div class="question-text">${q.q}</div>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
            <span class="question-difficulty">
              ${getDifficultyEmoji(q.difficulty)} ${q.difficulty}
            </span>
            <span class="question-difficulty">🏷️ ${q.topic}</span>
          </div>
        </div>

        <!-- Hint -->
        <div style="background:rgba(255,255,255,0.6);border:1px solid var(--ui-03);border-radius:var(--border-radius);padding:0.75rem 1rem;font-size:0.8125rem;color:var(--text-secondary)">
          <strong style="color:var(--text-primary)">💡 Tip:</strong> ${q.tips}
        </div>

        <!-- Answer Area -->
        <div class="answer-area">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
            <div style="font-size:0.875rem;font-weight:600;color:var(--text-secondary)">Your Answer</div>
            <div id="word-count-answer" style="font-size:0.75rem;color:var(--text-secondary)">0 words</div>
          </div>
          <textarea class="answer-textarea" id="answer-input" 
            placeholder="Type your answer here. Be specific, use examples, and structure your response clearly…"
          >${existingAnswer}</textarea>
          <hr class="section-divider">
          <div class="interview-actions">
            <div id="question-timer" class="interview-timer">02:00</div>
            <button class="btn btn-primary" id="submit-answer-btn" style="flex:1">
              Submit Answer & Get AI Feedback
            </button>
            <button class="btn btn-ghost btn-sm" id="skip-btn">Skip →</button>
          </div>
        </div>

        <!-- Feedback Area -->
        <div id="feedback-area" class="${session.feedbacks[session.currentIndex] ? '' : 'hidden'}">
          ${session.feedbacks[session.currentIndex] ? renderFeedbackInline(session.feedbacks[session.currentIndex]) : ''}
        </div>

        <!-- Nav buttons -->
        <div style="display:flex;gap:0.75rem;justify-content:space-between">
          <button class="btn btn-secondary ${session.currentIndex === 0 ? '' : ''}" id="prev-btn"
            ${session.currentIndex === 0 ? 'disabled' : ''}>← Previous</button>
          ${session.currentIndex < total - 1
            ? `<button class="btn btn-primary" id="next-btn">Next Question →</button>`
            : `<button class="btn btn-primary" id="finish-btn" style="background:var(--ibm-green)">🏁 Finish & See Results</button>`
          }
        </div>
      </div>

      <!-- Sidebar -->
      <div>
        <!-- Score Ring (if feedback available) -->
        <div class="feedback-panel mb-4">
          <div style="text-align:center;margin-bottom:0.75rem;font-size:0.875rem;font-weight:600">Session Score</div>
          <div class="feedback-score-ring" id="score-ring" style="--score:${computeSessionScore(session).avg}">
            <span class="feedback-score-value">${computeSessionScore(session).avg}%</span>
          </div>
          <div style="text-align:center;font-size:0.8125rem;color:var(--text-secondary);margin-top:0.5rem">
            ${computeSessionScore(session).answered} answered
          </div>
        </div>

        <!-- Question Navigator -->
        <div class="feedback-panel">
          <div style="font-size:0.875rem;font-weight:600;margin-bottom:0.75rem">Questions</div>
          <div class="interview-progress" id="question-nav">
            ${session.questions.map((q, i) => `
              <div class="interview-q-dot ${i === session.currentIndex ? 'current' : session.answers[i] ? 'answered' : ''}"
                data-idx="${i}">
                <div class="q-status-dot ${i === session.currentIndex ? 'current' : session.answers[i] ? 'answered' : ''}"></div>
                <span style="font-size:0.8rem">Q${i + 1}: ${q.topic}</span>
                ${session.feedbacks[i] ? `<span style="margin-left:auto;font-size:0.75rem;font-weight:600;color:${session.feedbacks[i].overallScore >= 70 ? 'var(--ibm-green)' : 'var(--ibm-orange)'}">
                  ${session.feedbacks[i].overallScore}%
                </span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function mountInterview(appState) {
  const session = appState.interviewSession;
  let timerInterval;
  let questionSeconds = 120;

  // Session timer (count up)
  const sessionStart = Date.now();
  const sessionTimerEl = document.getElementById('session-timer');
  const sessionInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
    const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const s = (elapsed % 60).toString().padStart(2, '0');
    if (sessionTimerEl) sessionTimerEl.textContent = `${m}:${s}`;
  }, 1000);

  // Question countdown timer
  const qTimerEl = document.getElementById('question-timer');
  timerInterval = setInterval(() => {
    questionSeconds--;
    const m = Math.floor(questionSeconds / 60).toString().padStart(2, '0');
    const s = (questionSeconds % 60).toString().padStart(2, '0');
    if (qTimerEl) {
      qTimerEl.textContent = `${m}:${s}`;
      qTimerEl.className = `interview-timer${questionSeconds <= 30 ? ' warning' : ''}`;
    }
    if (questionSeconds <= 0) clearInterval(timerInterval);
  }, 1000);

  // Word count
  const answerInput = document.getElementById('answer-input');
  const wordCountEl = document.getElementById('word-count-answer');
  answerInput?.addEventListener('input', () => {
    const words = answerInput.value.trim().split(/\s+/).filter(Boolean).length;
    if (wordCountEl) wordCountEl.textContent = `${words} words`;
  });
  // Init word count
  if (answerInput && wordCountEl) {
    const words = answerInput.value.trim().split(/\s+/).filter(Boolean).length;
    wordCountEl.textContent = `${words} words`;
  }

  // Submit answer
  document.getElementById('submit-answer-btn')?.addEventListener('click', () => {
    const answer = answerInput?.value || '';
    const question = session.questions[session.currentIndex];

    session.answers[session.currentIndex] = answer;
    const feedback = evaluateAnswer(question, answer, session.careerId);
    session.feedbacks[session.currentIndex] = feedback;

    clearInterval(timerInterval);
    saveState();

    // Show feedback
    const feedbackArea = document.getElementById('feedback-area');
    if (feedbackArea) {
      feedbackArea.innerHTML = renderFeedbackInline(feedback);
      feedbackArea.classList.remove('hidden');
      feedbackArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update score ring
    const scoreData = computeSessionScore(session);
    const ring = document.getElementById('score-ring');
    if (ring) {
      ring.style.setProperty('--score', scoreData.avg);
      const val = ring.querySelector('.feedback-score-value');
      if (val) val.textContent = scoreData.avg + '%';
    }

    // Update Q nav dot
    const dot = document.querySelector(`[data-idx="${session.currentIndex}"] .q-status-dot`);
    if (dot) dot.classList.add('answered');

    showToast(`AI scored your answer: ${feedback.overallScore}%`, feedback.overallScore >= 70 ? 'success' : 'info');
  });

  // Skip
  document.getElementById('skip-btn')?.addEventListener('click', () => {
    goToQuestion(session.currentIndex + 1, session, appState, timerInterval, sessionInterval);
  });

  // Prev
  document.getElementById('prev-btn')?.addEventListener('click', () => {
    if (session.currentIndex > 0) {
      goToQuestion(session.currentIndex - 1, session, appState, timerInterval, sessionInterval);
    }
  });

  // Next
  document.getElementById('next-btn')?.addEventListener('click', () => {
    saveCurrentAnswer(session, answerInput);
    goToQuestion(session.currentIndex + 1, session, appState, timerInterval, sessionInterval);
  });

  // Finish
  document.getElementById('finish-btn')?.addEventListener('click', () => {
    saveCurrentAnswer(session, answerInput);
    clearInterval(timerInterval);
    clearInterval(sessionInterval);
    session.completed = true;
    session.endedAt = Date.now();
    saveSession(session);
    appState.interviewSession = null;
    saveState();
    navigateTo('score');
    showToast('Interview complete! Check your Job Readiness Score 🎉', 'success');
  });

  // End session
  document.getElementById('end-session-btn')?.addEventListener('click', () => {
    if (confirm('End this interview session? Your progress will be saved.')) {
      clearInterval(timerInterval);
      clearInterval(sessionInterval);
      saveCurrentAnswer(session, answerInput);
      saveSession(session);
      appState.interviewSession = null;
      saveState();
      navigateTo('interview');
    }
  });

  // Question nav clicks
  document.querySelectorAll('[data-idx]').forEach(dot => {
    dot.addEventListener('click', () => {
      saveCurrentAnswer(session, answerInput);
      goToQuestion(parseInt(dot.dataset.idx), session, appState, timerInterval, sessionInterval);
    });
  });
}

function goToQuestion(idx, session, appState, timerInterval, sessionInterval) {
  if (idx < 0 || idx >= session.questions.length) return;
  session.currentIndex = idx;
  saveState();
  navigateTo('interview');
}

function saveCurrentAnswer(session, inputEl) {
  if (inputEl) session.answers[session.currentIndex] = inputEl.value;
}

function renderFeedbackInline(feedback) {
  const scoreColor = feedback.overallScore >= 70 ? 'var(--ibm-green)' : feedback.overallScore >= 50 ? 'var(--ibm-orange)' : 'var(--ibm-red)';
  return `
    <div class="card animate-in" style="border-color:${scoreColor};border-left-width:4px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <div style="font-size:2rem;font-weight:700;color:${scoreColor}">${feedback.overallScore}%</div>
        <div>
          <div style="font-weight:600">AI Feedback</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">
            ${feedback.overallScore >= 80 ? '🌟 Excellent' : feedback.overallScore >= 65 ? '✅ Good' : feedback.overallScore >= 45 ? '📈 Fair' : '⚠️ Needs Work'}
          </div>
        </div>
      </div>

      <!-- Criteria -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1rem">
        ${Object.entries(feedback.criteria).map(([key, val]) => `
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:3px">
              <span style="text-transform:capitalize;color:var(--text-secondary)">${key}</span>
              <span style="font-weight:600">${val}%</span>
            </div>
            <div class="progress-bar-wrap" style="height:5px">
              <div class="progress-bar-fill" style="width:${val}%;background:${val >= 70 ? 'var(--ibm-green)' : val >= 45 ? 'var(--ibm-orange)' : 'var(--ibm-red)'}"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <p style="font-size:0.875rem;line-height:1.55;margin-bottom:0.75rem">${feedback.feedback}</p>

      ${feedback.suggestions.length > 0 ? `
        <div class="ai-suggestion">
          <strong>💡 Suggestions:</strong>
          <ul style="margin-top:0.375rem;padding-left:1.25rem;font-size:0.8125rem">
            ${feedback.suggestions.map(s => `<li style="margin-bottom:3px">${s}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${feedback.keywords.length > 0 ? `
        <div style="margin-top:0.75rem">
          <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.375rem">Detected keywords:</div>
          <div class="skill-tag-list">
            ${feedback.keywords.map(k => `<span class="tag tag-teal" style="font-size:0.7rem">${k}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function getDifficultyEmoji(d) {
  return d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴';
}
