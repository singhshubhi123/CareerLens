/* =========================================================
   Dashboard Page
   ========================================================= */
import { navigateTo, saveState, el, drawRadarChart, showToast } from '../js/app.js';
import { calculateReadinessScore } from '../js/score.js';

export function render(state) {
  const container = el('div', { className: 'animate-in' });

  const readiness = calculateReadinessScore(state);
  const profileDone = !!state.profile;
  const careerDone  = state.selectedCareers.length > 0;
  const roadmapDone = !!state.roadmap;

  container.innerHTML = `
    <!-- Welcome Banner -->
    <div class="dashboard-welcome">
      <div class="welcome-text">
        <h2>Welcome back, ${state.profile?.name || 'Student'}! 👋</h2>
        <p>Your AI Career Copilot is ready. Let's land your dream job together.</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;">
          <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:12px;font-size:0.8125rem;">
            🎯 Job Readiness: <strong>${readiness.score}%</strong>
          </div>
          <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:12px;font-size:0.8125rem;">
            ⚡ ${state.profile?.skills?.length || 0} skills detected
          </div>
          <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:12px;font-size:0.8125rem;">
            🎓 ${state.completedCourses?.length || 0} courses completed
          </div>
        </div>
      </div>
      <div class="welcome-action">
        <button class="btn btn-lg" style="background:#fff;color:#0f62fe;font-weight:700;" 
          id="dash-cta-btn">
          ${!profileDone ? '📄 Analyze Resume' : !careerDone ? '🧭 Choose Career' : '🤖 Start Interview'}
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-4 mb-6 stagger">
      <div class="stat-card" style="--accent-color:${readiness.pillars.skills.color}">
        <div class="stat-label">Skills Detected</div>
        <div class="stat-value">${state.profile?.skills?.length || 0}</div>
        <div class="stat-desc">${state.profile ? `From your resume analysis` : 'Upload your resume to start'}</div>
      </div>
      <div class="stat-card" style="--accent-color:#0f62fe">
        <div class="stat-label">Job Readiness Score</div>
        <div class="stat-value" style="color:${readiness.level.color}">${readiness.score}<span style="font-size:1.25rem">%</span></div>
        <div class="stat-desc">${readiness.level.label}</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-teal)">
        <div class="stat-label">Courses Completed</div>
        <div class="stat-value">${state.completedCourses?.length || 0}</div>
        <div class="stat-desc">of ${15} IBM SkillsBuild courses</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Career Paths</div>
        <div class="stat-value">${state.selectedCareers?.length || 0}</div>
        <div class="stat-desc">target path${state.selectedCareers?.length !== 1 ? 's' : ''} selected</div>
      </div>
    </div>

    <!-- 2-col section -->
    <div class="grid grid-2 gap-5 mb-6">
      <!-- Journey Checklist -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ Your Career Journey</div>
          <span class="tag tag-blue" style="font-size:0.7rem">${countDoneSteps([profileDone, careerDone, roadmapDone])}/5 complete</span>
        </div>
        <div class="progress-tracker" id="step-list"></div>
      </div>

      <!-- Radar Chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Readiness Breakdown</div>
        </div>
        <div id="radar-chart-wrap" class="radar-wrap" style="padding:1rem;min-height:220px;"></div>
      </div>
    </div>

    <!-- Top Career Matches -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title">🚀 Top Career Matches</div>
        <button class="btn btn-ghost btn-sm" id="view-all-careers">View All →</button>
      </div>
      <div class="grid grid-3 stagger" id="top-careers-grid">
        <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-secondary)">
          ${!profileDone ? '📄 Analyze your resume to unlock career recommendations' : 'Loading matches…'}
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">⚡ Quick Actions</div>
      </div>
      <div class="grid grid-4 stagger" id="quick-actions"></div>
    </div>
  `;

  return container;
}

export function onMount(state) {
  // CTA button
  document.getElementById('dash-cta-btn')?.addEventListener('click', () => {
    const profileDone = !!state.profile;
    const careerDone  = state.selectedCareers.length > 0;
    navigateTo(!profileDone ? 'resume' : !careerDone ? 'careers' : 'interview');
  });

  document.getElementById('view-all-careers')?.addEventListener('click', () => navigateTo('careers'));

  // Step list
  renderStepList(state);

  // Radar chart
  renderRadar(state);

  // Top career matches
  renderTopCareers(state);

  // Quick actions
  renderQuickActions(state);
}

function countDoneSteps(arr) {
  return arr.filter(Boolean).length;
}

function renderStepList(state) {
  const steps = [
    { id: 'resume',    emoji: '📄', name: 'Analyze Resume',          status: !!state.profile,              page: 'resume' },
    { id: 'skills',    emoji: '⚡', name: 'Review Skill Gaps',       status: !!state.profile,              page: 'skills' },
    { id: 'careers',   emoji: '🎯', name: 'Choose Career Path',      status: state.selectedCareers.length > 0, page: 'careers' },
    { id: 'roadmap',   emoji: '🗺️', name: 'Generate Roadmap',       status: !!state.roadmap,              page: 'roadmap' },
    { id: 'interview', emoji: '🤖', name: 'Practice Mock Interview', status: false,                        page: 'interview' },
  ];

  const list = document.getElementById('step-list');
  if (!list) return;

  steps.forEach(step => {
    const div = el('div', {
      className: `progress-step ${step.status ? 'done' : 'active'}`,
    });
    div.innerHTML = `
      <span class="step-icon">${step.status ? '✅' : step.emoji}</span>
      <div class="step-info">
        <div class="step-name">${step.name}</div>
        <div class="step-status">${step.status ? 'Completed' : 'Pending'}</div>
      </div>
      <span class="step-arrow">›</span>
    `;
    div.addEventListener('click', () => navigateTo(step.page));
    list.appendChild(div);
  });
}

function renderRadar(state) {
  const readiness = calculateReadinessScore(state);
  const wrap = document.getElementById('radar-chart-wrap');
  if (!wrap) return;

  const p = readiness.pillars;
  const labels = ['Skills', 'Resume', 'Learning', 'Interview', 'Career'];
  const values = [p.skills.score, p.resume.score, p.courses.score, p.interview.score, p.career.score];
  drawRadarChart(wrap, labels, values, '#0f62fe');
}

function renderTopCareers(state) {
  import('../js/recommender.js').then(({ recommendCareers }) => {
    const grid = document.getElementById('top-careers-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const careers = recommendCareers(state.profile?.skills || []).slice(0, 3);
    careers.forEach(career => {
      const card = el('div', {
        className: 'career-card',
        style: `--career-color:${career.color}`,
      });
      card.innerHTML = `
        <div class="career-icon">${career.emoji}</div>
        <div class="career-title">${career.title}</div>
        <div class="career-desc">${career.description.substring(0, 90)}…</div>
        <div class="career-meta">
          <span class="career-match ${career.matchScore >= 60 ? 'match-high' : career.matchScore >= 35 ? 'match-medium' : 'match-low'}">${career.matchScore}% match</span>
          <span class="career-salary">${career.salaryRange}</span>
        </div>
      `;
      card.addEventListener('click', () => navigateTo('careers'));
      grid.appendChild(card);
    });
  });
}

function renderQuickActions(state) {
  const actions = [
    { emoji: '📄', label: 'Resume Analyzer',   page: 'resume',    desc: 'Parse & analyze', color: '#0f62fe' },
    { emoji: '🤖', label: 'Mock Interview',     page: 'interview', desc: 'AI-powered Q&A',  color: '#6929c4' },
    { emoji: '🎓', label: 'Courses',            page: 'courses',   desc: 'IBM SkillsBuild', color: '#007d79' },
    { emoji: '📊', label: 'Readiness Score',    page: 'score',     desc: 'Track progress',  color: '#198038' },
  ];
  const wrap = document.getElementById('quick-actions');
  if (!wrap) return;
  actions.forEach(a => {
    const card = el('div', {
      className: 'card card-sm',
      style: 'cursor:pointer;text-align:center;transition:box-shadow 0.15s,transform 0.15s',
    });
    card.innerHTML = `
      <div style="font-size:2rem;margin-bottom:0.5rem">${a.emoji}</div>
      <div style="font-weight:600;font-size:0.9375rem;margin-bottom:2px">${a.label}</div>
      <div style="font-size:0.8rem;color:var(--text-secondary)">${a.desc}</div>
    `;
    card.style.borderTop = `3px solid ${a.color}`;
    card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-3px)'; card.style.boxShadow = 'var(--shadow-md)'; });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.boxShadow = ''; });
    card.addEventListener('click', () => navigateTo(a.page));
    wrap.appendChild(card);
  });
}
