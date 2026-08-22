/* =========================================================
   Courses Page — IBM SkillsBuild Recommendations
   ========================================================= */
import { navigateTo, saveState, showToast, el } from '../js/app.js';
import { recommendCourses } from '../js/recommender.js';
import DATA from '../js/data.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });
  const careerIds = appState.selectedCareers.length > 0 ? appState.selectedCareers : [];
  const courses = recommendCourses(careerIds, appState.profile?.skills || []);

  const categories = ['all', 'ai', 'cloud', 'data', 'security', 'development', 'design', 'methodology'];
  const catLabels = { all: 'All Courses', ai: '🤖 AI & ML', cloud: '☁️ Cloud', data: '📊 Data', security: '🔐 Security', development: '💻 Development', design: '🎨 Design', methodology: '📋 Methodology' };

  container.innerHTML = `
    <div class="page-header">
      <h1>🎓 IBM SkillsBuild Courses</h1>
      <p>AI-curated courses from IBM SkillsBuild, ranked by your skill gaps and career goals.</p>
    </div>

    <!-- SkillsBuild Branding Strip -->
    <div class="skillsbuild-strip">
      <span class="ibm-logo">IBM</span>
      <span style="opacity:0.5">|</span>
      <span>SkillsBuild — Free learning for your career</span>
      <span style="margin-left:auto;font-size:0.75rem;opacity:0.8">${courses.length} courses available</span>
    </div>

    <!-- Stats -->
    <div class="grid grid-4 mb-5 stagger">
      <div class="stat-card" style="--accent-color:#0f62fe">
        <div class="stat-label">Available Courses</div>
        <div class="stat-value">${DATA.courses.length}</div>
        <div class="stat-desc">IBM SkillsBuild catalog</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Free Courses</div>
        <div class="stat-value">${DATA.courses.filter(c => c.free).length}</div>
        <div class="stat-desc">No cost to you</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-purple)">
        <div class="stat-label">Completed</div>
        <div class="stat-value">${appState.completedCourses?.length || 0}</div>
        <div class="stat-desc">courses finished</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-teal)">
        <div class="stat-label">Badges Earned</div>
        <div class="stat-value">${appState.completedCourses?.length || 0}</div>
        <div class="stat-desc">digital credentials</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4 flex-wrap" style="align-items:center">
      <div class="filter-tabs" id="cat-filter" style="margin-bottom:0">
        ${categories.map(cat => `
          <button class="filter-tab ${cat === 'all' ? 'active' : ''}" data-cat="${cat}">
            ${catLabels[cat] || cat}
          </button>
        `).join('')}
      </div>
      <div class="flex gap-2" style="margin-left:auto;flex-wrap:wrap">
        <select class="form-select" id="level-filter" style="width:auto;font-size:0.8125rem">
          <option value="">All Levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select class="form-select" id="price-filter" style="width:auto;font-size:0.8125rem">
          <option value="">All Prices</option>
          <option value="free">Free Only</option>
        </select>
      </div>
    </div>

    <!-- Course Grid -->
    <div class="grid grid-auto stagger" id="courses-grid">
      ${renderCourseCards(courses, appState.completedCourses || [])}
    </div>
  `;

  return container;
}

export function onMount(appState) {
  // Category filter
  document.querySelectorAll('[data-cat]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-cat]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      applyFilters(appState);
    });
  });

  document.getElementById('level-filter')?.addEventListener('change', () => applyFilters(appState));
  document.getElementById('price-filter')?.addEventListener('change', () => applyFilters(appState));

  // Enroll / complete buttons
  bindCourseButtons(appState);
}

function renderCourseCards(courses, completedCourses) {
  if (courses.length === 0) {
    return `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary)">No courses match your filters.</div>`;
  }

  return courses.map(course => {
    const isCompleted = completedCourses.includes(course.id);
    return `
      <div class="course-card" data-course-id="${course.id}">
        <div class="course-card-header" style="background:${course.color};"></div>
        <div class="course-card-body">
          <div class="course-provider">${course.provider}</div>
          <div class="course-title">${course.title}</div>
          <div class="course-desc">${course.description}</div>

          <div class="course-meta">
            <span class="course-meta-item">⏱ ${course.duration}</span>
            <span class="course-meta-item">📶 ${course.level}</span>
            <span class="course-meta-item">⭐ ${course.rating}</span>
            <span class="course-meta-item">👥 ${course.enrolled}</span>
          </div>

          <!-- Skills covered -->
          <div class="skill-tag-list mb-3">
            ${course.skills.map(s => `<span class="tag tag-blue" style="font-size:0.7rem">${s}</span>`).join('')}
          </div>

          ${course.badge ? `
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
              <span style="font-size:1rem">🏅</span>
              <span style="font-size:0.8125rem;font-weight:500;color:var(--ibm-purple)">Badge: ${course.badge}</span>
            </div>
          ` : ''}
        </div>

        <div class="course-footer">
          <span class="${course.free ? 'tag tag-green' : 'tag tag-yellow'}" style="font-size:0.75rem">
            ${course.free ? '✓ Free' : '💰 Premium'}
          </span>

          <div style="display:flex;gap:0.5rem">
            ${isCompleted
              ? `<span class="tag tag-green">✅ Completed</span>
                 <button class="btn btn-ghost btn-sm uncomplete-btn" data-id="${course.id}">Undo</button>`
              : `<button class="btn btn-secondary btn-sm complete-btn" data-id="${course.id}">Mark Complete</button>
                 <a href="${course.url}" target="_blank" class="btn btn-primary btn-sm">Enroll →</a>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function bindCourseButtons(appState) {
  document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (!appState.completedCourses.includes(id)) {
        appState.completedCourses.push(id);
        saveState();
        showToast('Course marked as complete! 🎓 Badge earned!', 'success');
        navigateTo('courses');
      }
    });
  });

  document.querySelectorAll('.uncomplete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      appState.completedCourses = appState.completedCourses.filter(c => c !== id);
      saveState();
      showToast('Course unmarked', 'info');
      navigateTo('courses');
    });
  });
}

function applyFilters(appState) {
  const activeCat = document.querySelector('[data-cat].active')?.dataset.cat || 'all';
  const level = document.getElementById('level-filter')?.value || '';
  const priceVal = document.getElementById('price-filter')?.value || '';

  const careerIds = appState.selectedCareers.length > 0 ? appState.selectedCareers : [];
  let courses = recommendCourses(careerIds, appState.profile?.skills || []);

  if (activeCat !== 'all') courses = courses.filter(c => c.category === activeCat);
  if (level) courses = courses.filter(c => c.level === level);
  if (priceVal === 'free') courses = courses.filter(c => c.free);

  const grid = document.getElementById('courses-grid');
  if (grid) {
    grid.innerHTML = renderCourseCards(courses, appState.completedCourses || []);
    bindCourseButtons(appState);
  }
}
