/* =========================================================
   Career Paths Page
   ========================================================= */
import { navigateTo, saveState, showToast, el } from '../js/app.js';
import { recommendCareers } from '../js/recommender.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });
  const careers = recommendCareers(appState.profile?.skills || []);

  container.innerHTML = `
    <div class="page-header">
      <h1>🚀 Career Path Recommender</h1>
      <p>AI-matched career paths based on your skills and experience. Select up to 2 paths to personalize your roadmap.</p>
    </div>

    <!-- Selected banner -->
    <div id="selection-banner" class="${appState.selectedCareers.length === 0 ? 'hidden' : ''}">
      <div class="card mb-4" style="border-color:var(--ibm-blue);background:#f0f5ff">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
          <div>
            <div style="font-weight:600">✅ Career paths selected</div>
            <div style="font-size:0.875rem;color:var(--text-secondary);margin-top:2px">
              ${appState.selectedCareers.map(id => careers.find(c => c.id === id)?.title).filter(Boolean).join(' + ')}
            </div>
          </div>
          <div style="display:flex;gap:0.75rem">
            <button class="btn btn-secondary btn-sm" id="goto-roadmap-btn">🗺️ Generate Roadmap</button>
            <button class="btn btn-primary btn-sm" id="goto-courses-btn">🎓 View Courses</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter row -->
    <div class="filter-tabs mb-4" id="demand-filter">
      <button class="filter-tab active" data-filter="all">All Paths (${careers.length})</button>
      <button class="filter-tab" data-filter="very-high">🔥 Very High Demand</button>
      <button class="filter-tab" data-filter="high">📈 High Demand</button>
      ${appState.profile ? '<button class="filter-tab" data-filter="best-match">⭐ Best Match</button>' : ''}
    </div>

    <!-- Career grid -->
    <div class="grid grid-auto stagger" id="careers-grid">
      ${renderCareerCards(careers, appState.selectedCareers)}
    </div>

    <!-- Detail Modal -->
    <div id="career-detail-panel" class="hidden"></div>
  `;

  return container;
}

export function onMount(appState) {
  document.getElementById('goto-roadmap-btn')?.addEventListener('click', () => {
    generateAndNavigate(appState, 'roadmap');
  });

  document.getElementById('goto-courses-btn')?.addEventListener('click', () => navigateTo('courses'));

  // Filter tabs
  document.querySelectorAll('[data-filter]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilter(tab.dataset.filter, appState);
    });
  });

  // Career card clicks
  bindCareerCards(appState);
}

function renderCareerCards(careers, selectedCareers) {
  return careers.map(career => `
    <div class="career-card ${selectedCareers.includes(career.id) ? 'selected' : ''}" 
      data-career-id="${career.id}" 
      style="--career-color:${career.color}; cursor:pointer">

      <!-- Match indicator -->
      ${selectedCareers.includes(career.id) ? '<div style="position:absolute;top:12px;right:12px;background:var(--ibm-blue);color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700">✓</div>' : ''}

      <div class="career-icon">${career.emoji}</div>
      <div class="career-title">${career.title}</div>
      <div class="career-desc">${career.description}</div>

      <!-- Match bar -->
      <div style="margin-bottom:0.75rem">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px">
          <span style="color:var(--text-secondary)">Skill Match</span>
          <span class="career-match ${career.matchScore >= 60 ? 'match-high' : career.matchScore >= 35 ? 'match-medium' : 'match-low'}"
            style="font-weight:700">${career.matchScore}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${career.matchScore}%;background:${career.color}"></div>
        </div>
      </div>

      <div class="career-meta">
        <div style="display:flex;flex-direction:column;gap:4px;width:100%">
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tag tag-blue" style="font-size:0.7rem">${career.demandLevel} Demand</span>
            <span class="tag tag-green" style="font-size:0.7rem">📈 ${career.growth}</span>
          </div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">${career.salaryRange}/yr</div>
        </div>
      </div>

      <!-- Skill gaps preview -->
      <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--ui-03)">
        <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.375rem">
          Skill gaps: ${career.gaps.missing.length} critical
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${career.gaps.missing.slice(0, 3).map(s => `<span class="tag tag-red" style="font-size:0.65rem">${s}</span>`).join('')}
          ${career.gaps.missing.length > 3 ? `<span class="tag tag-gray" style="font-size:0.65rem">+${career.gaps.missing.length - 3} more</span>` : ''}
        </div>
      </div>

      <!-- Action row -->
      <div style="margin-top:1rem;display:flex;gap:0.5rem">
        <button class="btn btn-sm ${selectedCareers.includes(career.id) ? 'btn-danger' : 'btn-primary'} flex-1 select-career-btn" 
          data-id="${career.id}">
          ${selectedCareers.includes(career.id) ? '✓ Selected' : '+ Select Path'}
        </button>
        <button class="btn btn-secondary btn-sm detail-btn" data-id="${career.id}">Details</button>
      </div>
    </div>
  `).join('');
}

function bindCareerCards(appState) {
  document.querySelectorAll('.select-career-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      toggleCareer(id, appState);
    });
  });

  document.querySelectorAll('.detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      showCareerDetail(btn.dataset.id, appState);
    });
  });
}

function toggleCareer(careerId, appState) {
  const max = 2;
  if (appState.selectedCareers.includes(careerId)) {
    appState.selectedCareers = appState.selectedCareers.filter(id => id !== careerId);
    showToast('Career path removed', 'info');
  } else {
    if (appState.selectedCareers.length >= max) {
      showToast(`You can select up to ${max} career paths`, 'warning');
      return;
    }
    appState.selectedCareers.push(careerId);
    showToast('Career path selected! 🎯', 'success');
  }
  saveState();
  navigateTo('careers'); // re-render
}

function applyFilter(filter, appState) {
  const careers = recommendCareers(appState.profile?.skills || []);
  const grid = document.getElementById('careers-grid');
  if (!grid) return;

  let filtered;
  if (filter === 'very-high') filtered = careers.filter(c => c.demandLevel === 'Very High');
  else if (filter === 'high') filtered = careers.filter(c => c.demandLevel === 'High');
  else if (filter === 'best-match') filtered = careers.filter(c => c.matchScore >= 40);
  else filtered = careers;

  grid.innerHTML = renderCareerCards(filtered, appState.selectedCareers);
  bindCareerCards(appState);
}

function showCareerDetail(careerId, appState) {
  import('../js/data.js').then(({ default: DATA }) => {
    const career = DATA.careerPaths.find(c => c.id === careerId);
    if (!career) return;

    const panel = document.getElementById('career-detail-panel');
    if (!panel) return;

    panel.classList.remove('hidden');
    panel.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:1rem" id="modal-overlay">
        <div class="card card-lg" style="max-width:600px;width:100%;max-height:80vh;overflow-y:auto;position:relative;animation:fadeIn 0.2s ease">
          <button id="close-modal" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary)">×</button>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
            <div style="font-size:3rem">${career.emoji}</div>
            <div>
              <div style="font-size:1.375rem;font-weight:700">${career.title}</div>
              <div style="font-size:0.875rem;color:var(--text-secondary)">${career.salaryRange} · ${career.demandLevel} Demand · ${career.growth} growth</div>
            </div>
          </div>
          <p style="font-size:0.9375rem;color:var(--text-secondary);margin-bottom:1.5rem;line-height:1.6">${career.description}</p>

          <div class="mb-4">
            <div style="font-weight:600;margin-bottom:0.5rem">🔑 Required Skills</div>
            <div class="skill-tag-list">
              ${career.requiredSkills.map(s => {
                const has = appState.profile?.skills?.map(sk => sk.toLowerCase()).includes(s.toLowerCase());
                return `<span class="skill-chip ${has ? 'strong' : 'missing'}">${has ? '✓ ' : ''}${s}</span>`;
              }).join('')}
            </div>
          </div>

          <div class="mb-4">
            <div style="font-weight:600;margin-bottom:0.5rem">⭐ Nice-to-Have Skills</div>
            <div class="skill-tag-list">
              ${career.niceToHave.map(s => `<span class="skill-chip partial">${s}</span>`).join('')}
            </div>
          </div>

          <div class="mb-4">
            <div style="font-weight:600;margin-bottom:0.5rem">📈 Career Ladder</div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">
              ${career.roles.map((role, i) => `
                <span style="font-size:0.8125rem;background:var(--ui-02);padding:4px 10px;border-radius:12px">${role}</span>
                ${i < career.roles.length - 1 ? '<span style="color:var(--text-secondary)">→</span>' : ''}
              `).join('')}
            </div>
          </div>

          <div>
            <div style="font-weight:600;margin-bottom:0.5rem">🏢 Companies Hiring</div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              ${career.companies.map(c => `<span class="tag tag-blue">${c}</span>`).join('')}
            </div>
          </div>

          <div style="display:flex;gap:0.75rem;margin-top:1.5rem">
            <button class="btn btn-primary flex-1" id="select-from-detail" data-id="${career.id}">
              ${appState.selectedCareers.includes(career.id) ? '✓ Selected' : '+ Select This Path'}
            </button>
            <button class="btn btn-secondary" id="close-modal-btn">Close</button>
          </div>
        </div>
      </div>
    `;

    const closeModal = () => { panel.classList.add('hidden'); panel.innerHTML = ''; };
    document.getElementById('close-modal')?.addEventListener('click', closeModal);
    document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'modal-overlay') closeModal();
    });
    document.getElementById('select-from-detail')?.addEventListener('click', () => {
      closeModal();
      toggleCareer(careerId, appState);
    });
  });
}

function generateAndNavigate(appState, target) {
  import('../js/roadmap.js').then(({ generateRoadmap }) => {
    const roadmap = generateRoadmap(appState.selectedCareers, appState.profile?.skills || [], appState.profile?.experience || 0);
    appState.roadmap = roadmap;
    saveState();
    navigateTo(target);
  });
}
