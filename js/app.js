/* =========================================================
   AI Career Copilot — Application State & Router
   ========================================================= */

/**
 * Global application state (single source of truth).
 * Persisted to localStorage between sessions.
 */
export const state = {
  profile: null,           // { name, skills, experience, education, resumeScore, ... }
  selectedCareers: [],     // array of career ids
  roadmap: null,           // generated roadmap object
  completedCourses: [],    // array of course ids
  interviewSession: null,  // current interview session
  currentPage: 'dashboard',
};

/* Load persisted state */
function loadState() {
  try {
    const saved = localStorage.getItem('careerCopilotState');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  } catch (e) {
    console.warn('Could not restore state:', e);
  }
}

/* Save state to localStorage (debounced) */
let saveTimer;
export function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const toSave = { ...state };
      delete toSave.interviewSession; // session is transient
      localStorage.setItem('careerCopilotState', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  }, 300);
}

/* =========================================================
   ROUTER
   ========================================================= */

const routes = {
  dashboard: () => import('../pages/dashboard.js'),
  resume:    () => import('../pages/resume.js'),
  skills:    () => import('../pages/skills.js'),
  careers:   () => import('../pages/careers.js'),
  roadmap:   () => import('../pages/roadmap.js'),
  courses:   () => import('../pages/courses.js'),
  interview: () => import('../pages/interview.js'),
  score:     () => import('../pages/score.js'),
};

let currentPage = null;

export async function navigateTo(pageId, params = {}) {
  if (!routes[pageId]) {
    console.warn(`Unknown page: ${pageId}`);
    pageId = 'dashboard';
  }

  state.currentPage = pageId;
  saveState();

  // Update sidebar active state
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  // Show loading indicator
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
      <div style="text-align:center;">
        <div class="spinner" style="margin:0 auto 1rem;width:40px;height:40px;border-width:4px;"></div>
        <p style="color:var(--text-secondary);font-size:0.875rem;">Loading…</p>
      </div>
    </div>
  `;

  try {
    const module = await routes[pageId]();
    currentPage = module;
    main.innerHTML = '';
    const el = module.render(state, params);
    main.appendChild(el);
    if (module.onMount) module.onMount(state, params);
    main.scrollTo(0, 0);
    window.scrollTo(0, 0);
  } catch (err) {
    console.error('Page load error:', err);
    main.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>${err.message}</p>
        <button class="btn btn-primary mt-4" onclick="window.location.reload()">Reload</button>
      </div>
    `;
  }
}

/* =========================================================
   TOAST NOTIFICATIONS
   ========================================================= */
export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${getToastIcon(type)}</span>
    <span style="flex:1">${message}</span>
    <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:1.1rem;padding:0 4px;">×</button>
  `;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

function getToastIcon(type) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  return icons[type] || icons.info;
}

/* =========================================================
   UTILITY HELPERS (shared across pages)
   ========================================================= */

/** Create a DOM element with properties */
export function el(tag, attrs = {}, ...children) {
  const elem = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'className') elem.className = val;
    else if (key === 'innerHTML') elem.innerHTML = val;
    else if (key === 'textContent') elem.textContent = val;
    else if (key.startsWith('on') && typeof val === 'function') {
      elem.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      elem.setAttribute(key, val);
    }
  }
  for (const child of children) {
    if (typeof child === 'string') elem.insertAdjacentHTML('beforeend', child);
    else if (child instanceof Node) elem.appendChild(child);
  }
  return elem;
}

/** Format a score as a colored badge */
export function scoreColor(score) {
  if (score >= 75) return 'var(--ibm-green)';
  if (score >= 50) return 'var(--ibm-orange)';
  return 'var(--ibm-red)';
}

export function scoreLabel(score) {
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Moderate';
  return 'Needs Work';
}

/** Draw a simple radar chart (SVG) */
export function drawRadarChart(container, labels, values, color = '#0f62fe') {
  const size = 260;
  const cx = size / 2, cy = size / 2;
  const R = 100;
  const n = labels.length;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointX = (r, i) => cx + r * Math.cos(angle(i));
  const pointY = (r, i) => cy + r * Math.sin(angle(i));

  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${size}px">`;

  // Grid rings
  [0.25, 0.5, 0.75, 1].forEach(frac => {
    const points = [...Array(n)].map((_, i) => `${pointX(R * frac, i)},${pointY(R * frac, i)}`).join(' ');
    svg += `<polygon points="${points}" fill="none" stroke="#e0e0e0" stroke-width="1"/>`;
  });

  // Axis lines
  for (let i = 0; i < n; i++) {
    svg += `<line x1="${cx}" y1="${cy}" x2="${pointX(R, i)}" y2="${pointY(R, i)}" stroke="#e0e0e0" stroke-width="1"/>`;
  }

  // Data polygon
  const dataPoints = values.map((v, i) => `${pointX(R * (v / 100), i)},${pointY(R * (v / 100), i)}`).join(' ');
  svg += `<polygon points="${dataPoints}" fill="${color}33" stroke="${color}" stroke-width="2"/>`;

  // Data dots
  values.forEach((v, i) => {
    svg += `<circle cx="${pointX(R * (v / 100), i)}" cy="${pointY(R * (v / 100), i)}" r="4" fill="${color}"/>`;
  });

  // Labels
  labels.forEach((label, i) => {
    const lx = pointX(R + 20, i);
    const ly = pointY(R + 20, i);
    const anchor = lx < cx - 5 ? 'end' : lx > cx + 5 ? 'start' : 'middle';
    svg += `<text x="${lx}" y="${ly + 4}" text-anchor="${anchor}" font-size="9" font-family="IBM Plex Sans,sans-serif" fill="#525252">${label}</text>`;
  });

  svg += '</svg>';
  container.innerHTML = svg;
}

/* =========================================================
   APP BOOTSTRAP
   ========================================================= */
export function initApp() {
  loadState();

  // Set up sidebar navigation
  document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.page);
    });
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.querySelector('.app-sidebar');
  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // Navigate to starting page
  navigateTo(state.currentPage || 'dashboard');
}
