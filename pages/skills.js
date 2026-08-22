/* =========================================================
   Skill Gap Analyzer Page
   ========================================================= */
import { navigateTo, saveState, el, drawRadarChart } from '../js/app.js';
import { recommendCareers, computeSkillMatrix } from '../js/recommender.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });

  if (!appState.profile) {
    container.innerHTML = `
      <div class="page-header">
        <h1>⚡ Skill Gap Analyzer</h1>
        <p>Understand exactly which skills you have, which you need, and the gap between where you are and where you want to be.</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>No Resume Analyzed Yet</h3>
        <p>Please analyze your resume first to unlock the Skill Gap Analyzer.</p>
        <button class="btn btn-primary mt-4" id="go-resume-btn">📄 Go to Resume Analyzer</button>
      </div>
    `;
    return container;
  }

  const allCareers = recommendCareers(appState.profile.skills);
  const targetCareerIds = appState.selectedCareers.length > 0
    ? appState.selectedCareers
    : [allCareers[0]?.id].filter(Boolean);

  const matrix = computeSkillMatrix(targetCareerIds, appState.profile.skills);
  const topTarget = allCareers.find(c => targetCareerIds.includes(c.id)) || allCareers[0];

  const covered = matrix.filter(s => s.userHas);
  const missing = matrix.filter(s => !s.userHas && s.requiredBy > 0);
  const niceToHave = matrix.filter(s => !s.userHas && s.requiredBy === 0);

  container.innerHTML = `
    <div class="page-header">
      <h1>⚡ Skill Gap Analyzer</h1>
      <p>Comparing your skills against the requirements for <strong>${topTarget?.title || 'your selected careers'}</strong>.</p>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-4 mb-6 stagger">
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Skills You Have</div>
        <div class="stat-value" style="color:var(--ibm-green)">${covered.length}</div>
        <div class="stat-desc">out of ${matrix.length} required</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-red)">
        <div class="stat-label">Critical Gaps</div>
        <div class="stat-value" style="color:var(--ibm-red)">${missing.length}</div>
        <div class="stat-desc">required skills missing</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-yellow)">
        <div class="stat-label">Nice-to-Haves</div>
        <div class="stat-value" style="color:var(--ibm-orange)">${niceToHave.length}</div>
        <div class="stat-desc">bonus skills to learn</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-blue)">
        <div class="stat-label">Coverage</div>
        <div class="stat-value" style="color:var(--ibm-blue)">${matrix.length > 0 ? Math.round((covered.length / matrix.length) * 100) : 0}%</div>
        <div class="stat-desc">of required skills covered</div>
      </div>
    </div>

    <!-- Career Selector -->
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title">🎯 Analyzing Against Career</div>
        <button class="btn btn-ghost btn-sm" id="change-career-btn">Change →</button>
      </div>
      <div class="flex gap-3 flex-wrap" id="career-selector">
        ${allCareers.slice(0, 5).map(c => `
          <button class="filter-tab ${targetCareerIds.includes(c.id) ? 'active' : ''}" 
            data-career="${c.id}" style="--career-color:${c.color}">
            ${c.emoji} ${c.title} <span style="opacity:0.75">(${c.matchScore}%)</span>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-2 gap-5 mb-5">
      <!-- Skill bar chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Skills by Importance</div>
          <span class="tag tag-blue" style="font-size:0.7rem">Top 10</span>
        </div>
        <div id="skill-bars">
          ${renderSkillBars(matrix.slice(0, 10))}
        </div>
      </div>

      <!-- Radar chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🕸️ Skill Radar</div>
        </div>
        <div id="radar-container" class="radar-wrap" style="min-height:260px"></div>
      </div>
    </div>

    <!-- Missing Skills -->
    ${missing.length > 0 ? `
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title">🚨 Critical Skill Gaps (Required)</div>
        <span class="tag tag-red">${missing.length} missing</span>
      </div>
      <p style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1rem">
        These are the required skills you currently lack. Closing these gaps will significantly improve your job readiness.
      </p>
      <div class="skill-tag-list">
        ${missing.map(s => `
          <span class="skill-chip missing" title="${s.requiredBy} career(s) require this skill">
            ${s.skill} <span style="font-size:0.7rem;opacity:0.75">×${s.requiredBy}</span>
          </span>
        `).join('')}
      </div>
      <div class="mt-4">
        <button class="btn btn-primary btn-sm" id="find-courses-btn">🎓 Find Courses for These Skills →</button>
      </div>
    </div>
    ` : `
    <div class="card mb-5" style="border-color:var(--ibm-green)">
      <div style="display:flex;align-items:center;gap:1rem">
        <div style="font-size:2.5rem">🎉</div>
        <div>
          <div style="font-weight:600;font-size:1.0625rem">No Critical Gaps!</div>
          <div style="color:var(--text-secondary);font-size:0.875rem">You have all the required skills for your target career. Focus on nice-to-haves and portfolio projects.</div>
        </div>
      </div>
    </div>
    `}

    <!-- You have -->
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title">✅ Skills You Already Have</div>
        <span class="tag tag-green">${covered.length} skills</span>
      </div>
      <div class="skill-tag-list">
        ${covered.length > 0
          ? covered.map(s => `<span class="skill-chip strong">${s.skill}</span>`).join('')
          : '<p style="color:var(--text-secondary);font-size:0.875rem">No matching skills detected yet. Upload your resume or add skills manually.</p>'
        }
      </div>
    </div>

    <!-- Nice to have -->
    ${niceToHave.length > 0 ? `
    <div class="card">
      <div class="card-header">
        <div class="card-title">⭐ Nice-to-Have Skills</div>
        <span class="tag tag-yellow">${niceToHave.length} skills</span>
      </div>
      <p style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1rem">
        These aren't required, but having them will make you a stronger candidate.
      </p>
      <div class="skill-tag-list">
        ${niceToHave.map(s => `<span class="skill-chip partial">${s.skill}</span>`).join('')}
      </div>
    </div>
    ` : ''}
  `;

  return container;
}

export function onMount(appState) {
  document.getElementById('go-resume-btn')?.addEventListener('click', () => navigateTo('resume'));
  document.getElementById('change-career-btn')?.addEventListener('click', () => navigateTo('careers'));
  document.getElementById('find-courses-btn')?.addEventListener('click', () => navigateTo('courses'));

  // Career selector tabs
  document.querySelectorAll('[data-career]').forEach(btn => {
    btn.addEventListener('click', () => {
      const careerId = btn.dataset.career;
      if (!appState.selectedCareers.includes(careerId)) {
        appState.selectedCareers = [careerId];
      } else {
        appState.selectedCareers = [];
      }
      saveState();
      navigateTo('skills');
    });
  });

  // Radar chart
  renderRadarForCareers(appState);
}

function renderSkillBars(matrix) {
  if (matrix.length === 0) return '<p style="color:var(--text-secondary);font-size:0.875rem;padding:1rem 0">No skill data available.</p>';
  return matrix.map(item => {
    const pct = Math.min(100, (item.importance / (matrix[0].importance || 1)) * 100);
    const color = item.userHas ? 'var(--ibm-green)' : 'var(--ibm-red)';
    return `
      <div class="skill-gap-row">
        <div class="skill-gap-name">${item.skill}</div>
        <div class="skill-gap-bar">
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
        </div>
        <div class="skill-gap-status">
          ${item.userHas
            ? '<span class="tag tag-green" style="font-size:0.7rem">✓ Have</span>'
            : '<span class="tag tag-red" style="font-size:0.7rem">✗ Gap</span>'}
        </div>
      </div>
    `;
  }).join('');
}

function renderRadarForCareers(appState) {
  const container = document.getElementById('radar-container');
  if (!container || !appState.profile) return;

  const categories = [
    { label: 'Programming', skills: ['Python','JavaScript','Java','TypeScript','SQL'] },
    { label: 'Web/API',     skills: ['React','Node.js','REST APIs','HTML/CSS','GraphQL'] },
    { label: 'Data/AI',     skills: ['Machine Learning','Pandas','TensorFlow','Data Visualization','Statistics'] },
    { label: 'Cloud/DevOps',skills: ['Docker','Kubernetes','AWS','CI/CD','Linux'] },
    { label: 'Soft Skills', skills: ['Communication','Problem Solving','Agile/Scrum','Leadership'] },
    { label: 'Security',    skills: ['Network Security','Cryptography','OWASP','SIEM'] },
  ];

  const userSet = new Set(appState.profile.skills.map(s => s.toLowerCase()));
  const values = categories.map(cat => {
    const matches = cat.skills.filter(s => userSet.has(s.toLowerCase())).length;
    return Math.round((matches / cat.skills.length) * 100);
  });

  drawRadarChart(container, categories.map(c => c.label), values, '#6929c4');
}
