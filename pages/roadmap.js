/* =========================================================
   Learning Roadmap Page
   ========================================================= */
import { navigateTo, saveState, showToast, el } from '../js/app.js';
import { generateRoadmap } from '../js/roadmap.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });

  if (appState.selectedCareers.length === 0) {
    container.innerHTML = `
      <div class="page-header">
        <h1>🗺️ Learning Roadmap</h1>
        <p>Your personalized, phase-by-phase path to your dream career.</p>
      </div>
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>Select a Career Path First</h3>
        <p>Choose your target career to generate a personalized learning roadmap.</p>
        <button class="btn btn-primary mt-4" id="go-careers-btn">🚀 Choose Career Path</button>
      </div>
    `;
    return container;
  }

  // Generate or use cached roadmap
  if (!appState.roadmap || !appState.roadmap.careerId || !appState.selectedCareers.includes(appState.roadmap.careerId)) {
    appState.roadmap = generateRoadmap(appState.selectedCareers, appState.profile?.skills || [], appState.profile?.experience || 0);
    saveState();
  }

  const roadmap = appState.roadmap;
  const totalMilestones = roadmap.phases.flatMap(p => p.milestones).length;
  const completedMilestones = roadmap.phases.flatMap(p => p.milestones).filter(m => m.done).length;
  const overallPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  container.innerHTML = `
    <div class="page-header">
      <h1>🗺️ Learning Roadmap</h1>
      <p>Your personalized path to becoming a <strong>${roadmap.careerTitle}</strong>. Total duration: ~${roadmap.totalDuration}.</p>
    </div>

    <!-- Progress Overview -->
    <div class="card mb-6">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
        <div>
          <div style="font-size:1.125rem;font-weight:600">Overall Progress</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">${completedMilestones} of ${totalMilestones} milestones completed</div>
        </div>
        <div style="font-size:1.75rem;font-weight:700;color:var(--ibm-blue)">${overallPct}%</div>
      </div>
      <div class="progress-bar-wrap" style="height:12px">
        <div class="progress-bar-fill" id="overall-bar" style="width:${overallPct}%;background:linear-gradient(90deg,#0f62fe,#6929c4)"></div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1rem;flex-wrap:wrap">
        ${roadmap.phases.map(phase => {
          const done = phase.milestones.filter(m => m.done).length;
          const total = phase.milestones.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return `
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem">
              <div style="width:10px;height:10px;border-radius:50%;background:${phase.color}"></div>
              <span style="color:var(--text-secondary)">${phase.label}: ${pct}%</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Phases Timeline -->
    <div class="roadmap-timeline" id="roadmap-phases">
      ${roadmap.phases.map((phase, pIdx) => renderPhase(phase, pIdx)).join('')}
    </div>

    <!-- Action Row -->
    <div class="flex gap-3 mt-6 flex-wrap">
      <button class="btn btn-primary" id="goto-courses-btn">🎓 View Recommended Courses</button>
      <button class="btn btn-secondary" id="goto-interview-btn">🤖 Practice Mock Interview</button>
      <button class="btn btn-ghost" id="regenerate-btn">🔄 Regenerate Roadmap</button>
    </div>
  `;

  return container;
}

export function onMount(appState) {
  document.getElementById('go-careers-btn')?.addEventListener('click', () => navigateTo('careers'));
  document.getElementById('goto-courses-btn')?.addEventListener('click', () => navigateTo('courses'));
  document.getElementById('goto-interview-btn')?.addEventListener('click', () => navigateTo('interview'));

  document.getElementById('regenerate-btn')?.addEventListener('click', () => {
    appState.roadmap = null;
    saveState();
    navigateTo('roadmap');
    showToast('Roadmap regenerated!', 'success');
  });

  // Milestone checkboxes
  document.querySelectorAll('.milestone-check').forEach(box => {
    box.addEventListener('click', () => {
      const phaseId = box.dataset.phase;
      const milestoneId = box.dataset.id;
      toggleMilestone(appState, phaseId, milestoneId);
    });
  });

  // Phase collapse toggles
  document.querySelectorAll('.phase-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.closest('.roadmap-phase').querySelector('.phase-items');
      const isHidden = body.style.display === 'none';
      body.style.display = isHidden ? '' : 'none';
      btn.textContent = isHidden ? '▼' : '▶';
    });
  });
}

function renderPhase(phase, pIdx) {
  const done = phase.milestones.filter(m => m.done).length;
  const total = phase.milestones.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = pct === 100;

  return `
    <div class="roadmap-phase ${isComplete ? 'completed' : ''}" 
      style="--phase-color:${phase.color}">
      
      <div class="phase-header">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${phase.color}">${phase.label}</span>
            ${isComplete ? '<span class="tag tag-green" style="font-size:0.65rem">✓ Complete</span>' : ''}
          </div>
          <div class="phase-title">${phase.title}</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:2px">${phase.description}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="phase-duration">${phase.duration}</div>
          <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px">${done}/${total} done</div>
          <button class="phase-toggle btn btn-ghost btn-sm" style="margin-top:4px">▼</button>
        </div>
      </div>

      <!-- Phase progress bar -->
      <div class="progress-bar-wrap mb-3" style="height:4px">
        <div class="progress-bar-fill" style="width:${pct}%;background:${phase.color}"></div>
      </div>

      <div class="phase-items">
        <!-- Skills to learn -->
        ${phase.skills.length > 0 ? `
          <div style="margin-bottom:0.75rem">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">Skills to Learn</div>
            <div class="skill-tag-list">
              ${phase.skills.map(s => `<span class="skill-chip missing">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Recommended courses in this phase -->
        ${phase.courses.length > 0 ? `
          <div style="margin-bottom:0.75rem">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">Recommended Courses</div>
            ${phase.courses.map(course => `
              <div class="phase-item" style="justify-content:space-between;margin-bottom:0.375rem">
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <span style="font-size:1rem">🎓</span>
                  <div>
                    <div style="font-size:0.875rem;font-weight:500">${course.title}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary)">${course.duration} · ${course.level} ${course.free ? '· Free' : ''}</div>
                  </div>
                </div>
                ${course.badge ? `<span class="tag tag-purple" style="font-size:0.65rem">${course.badge}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Milestones checklist -->
        <div>
          <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">Milestones</div>
          ${phase.milestones.map(m => `
            <div class="phase-item" style="gap:0.75rem">
              <div class="phase-item-check milestone-check ${m.done ? 'checked' : ''}" 
                data-phase="${phase.id}" data-id="${m.id}">
                ${m.done ? '<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
              </div>
              <span style="${m.done ? 'text-decoration:line-through;color:var(--text-secondary)' : ''}">${m.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function toggleMilestone(appState, phaseId, milestoneId) {
  if (!appState.roadmap) return;
  const phase = appState.roadmap.phases.find(p => p.id === phaseId);
  if (!phase) return;
  const milestone = phase.milestones.find(m => m.id === milestoneId);
  if (!milestone) return;
  milestone.done = !milestone.done;
  saveState();

  // Update UI without full re-render
  const check = document.querySelector(`.milestone-check[data-phase="${phaseId}"][data-id="${milestoneId}"]`);
  if (check) {
    check.classList.toggle('checked', milestone.done);
    check.innerHTML = milestone.done
      ? '<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '';
    const label = check.nextElementSibling;
    if (label) label.style.cssText = milestone.done ? 'text-decoration:line-through;color:var(--text-secondary)' : '';
  }

  // Update overall progress
  const totalMilestones = appState.roadmap.phases.flatMap(p => p.milestones).length;
  const completedMilestones = appState.roadmap.phases.flatMap(p => p.milestones).filter(m => m.done).length;
  const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
  const bar = document.getElementById('overall-bar');
  if (bar) bar.style.width = pct + '%';

  if (milestone.done) showToast('Milestone completed! 🎉', 'success');
}
