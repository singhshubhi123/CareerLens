/* =========================================================
   CareerLens — Achievements Page
   XP levels, streaks, badge collection
   ========================================================= */
import { navigateTo, el } from '../js/app.js';
import {
  BADGES, CATEGORY_META, TIER_COLORS,
  getTotalXP, getLevel, getLevelProgress, getXPToNextLevel,
} from '../js/achievements.js';

const XP_PER_LEVEL = 500;

export function render(appState) {
  const container = el('div', { className: 'animate-in' });

  const xp      = getTotalXP(appState);
  const level   = getLevel(xp);
  const prog    = getLevelProgress(xp);
  const toNext  = getXPToNextLevel(xp);
  const streak  = appState.streaks?.current  || 0;
  const longest = appState.streaks?.longest  || 0;
  const earned  = appState.badges || [];
  const total   = BADGES.length;

  // Group BADGES by category
  const categoryOrder = ['learning', 'interview', 'career', 'profile', 'streaks'];

  container.innerHTML = `
    <div class="page-header">
      <h1>🏅 Achievements</h1>
      <p>Earn XP and unlock badges by completing actions across CareerLens.</p>
    </div>

    <!-- XP Hero Card -->
    <div class="card mb-5" style="background:linear-gradient(135deg,#0f62fe 0%,#6929c4 100%);color:#fff;border:none">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem">
        <div style="flex:1;min-width:200px">
          <div style="font-size:0.8125rem;opacity:0.8;margin-bottom:4px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase">Current Level</div>
          <div style="font-size:3rem;font-weight:700;line-height:1">Level ${level}</div>
          <div style="font-size:0.9375rem;opacity:0.9;margin-top:4px">${xp} XP total · ${toNext} XP to Level ${level + 1}</div>

          <div style="margin-top:1rem">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;opacity:0.8;margin-bottom:6px">
              <span>Level ${level}</span><span>Level ${level + 1}</span>
            </div>
            <div style="background:rgba(255,255,255,0.25);border-radius:8px;height:10px;overflow:hidden">
              <div style="background:#fff;height:100%;border-radius:8px;width:${prog.toFixed(1)}%;transition:width 0.6s ease"></div>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:1rem 1.25rem;text-align:center;min-width:80px">
            <div style="font-size:1.75rem;font-weight:700">${streak}</div>
            <div style="font-size:0.75rem;opacity:0.85">🔥 Day Streak</div>
          </div>
          <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:1rem 1.25rem;text-align:center;min-width:80px">
            <div style="font-size:1.75rem;font-weight:700">${earned.length}</div>
            <div style="font-size:0.75rem;opacity:0.85">🏅 Badges</div>
          </div>
          <div style="background:rgba(255,255,255,0.15);border-radius:12px;padding:1rem 1.25rem;text-align:center;min-width:80px">
            <div style="font-size:1.75rem;font-weight:700">${xp}</div>
            <div style="font-size:0.75rem;opacity:0.85">⚡ Total XP</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-4 mb-5 stagger">
      <div class="stat-card" style="--accent-color:var(--ibm-blue)">
        <div class="stat-label">Total XP</div>
        <div class="stat-value">${xp}</div>
        <div class="stat-desc">experience points earned</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-purple)">
        <div class="stat-label">Badges Earned</div>
        <div class="stat-value">${earned.length}<span style="font-size:1.25rem;color:var(--text-secondary)">/${total}</span></div>
        <div class="stat-desc">badges unlocked</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-orange)">
        <div class="stat-label">Current Streak</div>
        <div class="stat-value">${streak}<span style="font-size:1.25rem"> days</span></div>
        <div class="stat-desc">consecutive activity days</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Longest Streak</div>
        <div class="stat-value">${longest}<span style="font-size:1.25rem"> days</span></div>
        <div class="stat-desc">personal best streak</div>
      </div>
    </div>

    <!-- Badge Categories -->
    ${categoryOrder.map(cat => _renderCategory(cat, earned)).join('')}

    <!-- Share Progress -->
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">📤 Share Your Progress</div>
      </div>
      <div style="background:var(--ui-02);border-radius:var(--border-radius);padding:1rem;font-family:'IBM Plex Mono',monospace;font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1rem" id="share-text">
        I've earned ${earned.length}/${total} badges on CareerLens! 🏅
        Level ${level} · ${xp} XP · ${streak}-day streak
        Top badges: ${earned.slice(-3).map(b => b.icon + ' ' + b.name).join(', ') || 'Just getting started!'}
      </div>
      <button class="btn btn-secondary btn-sm" id="copy-share-btn">📋 Copy to Clipboard</button>
    </div>
  `;

  return container;
}

export function onMount(appState) {
  document.getElementById('copy-share-btn')?.addEventListener('click', () => {
    const text = document.getElementById('share-text')?.textContent?.trim() || '';
    navigator.clipboard.writeText(text).then(() => {
      import('../js/app.js').then(({ showToast }) => showToast('Copied to clipboard! 📋', 'success'));
    }).catch(() => {
      import('../js/app.js').then(({ showToast }) => showToast('Copy failed — please select and copy manually', 'warning'));
    });
  });
}

/* ----------------------------------------------------------
   PRIVATE RENDERERS
---------------------------------------------------------- */

function _renderCategory(cat, earned) {
  const meta    = CATEGORY_META[cat];
  const badges  = BADGES.filter(b => b.category === cat);
  const earnedIds = new Set(earned.map(b => b.id));

  return `
    <div class="card mb-4">
      <div class="card-header" style="margin-bottom:1.25rem">
        <div class="card-title" style="color:${meta.color}">${meta.label} Badges</div>
        <span class="tag ${meta.tagClass}" style="font-size:0.7rem">
          ${badges.filter(b => earnedIds.has(b.id)).length} / ${badges.length}
        </span>
      </div>
      <div class="grid grid-auto stagger">
        ${badges.map(badge => _renderBadgeCard(badge, earned.find(e => e.id === badge.id), meta)).join('')}
      </div>
    </div>
  `;
}

function _renderBadgeCard(badge, earnedEntry, meta) {
  const isEarned   = !!earnedEntry;
  const tierColor  = TIER_COLORS[badge.tier] || '#9e9e9e';
  const earnedDate = earnedEntry ? _formatDate(earnedEntry.earnedAt) : null;

  if (isEarned) {
    return `
      <div class="card card-sm" style="border-top:3px solid ${tierColor};position:relative;text-align:center;padding:1.25rem 1rem">
        <div style="font-size:2.5rem;margin-bottom:0.5rem">${badge.icon}</div>
        <div style="font-weight:700;font-size:0.9375rem;margin-bottom:4px">${badge.name}</div>
        <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.75rem;line-height:1.4">${badge.description}</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <span class="tag tag-green" style="font-size:0.7rem">✓ Earned</span>
          <span style="font-size:0.7rem;color:var(--text-secondary)">${earnedDate}</span>
          <span class="tag ${meta.tagClass}" style="font-size:0.65rem">+${badge.xp} XP</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="card card-sm" style="border-top:3px solid var(--ui-03);text-align:center;padding:1.25rem 1rem;filter:grayscale(0.6);opacity:0.65">
      <div style="font-size:2.5rem;margin-bottom:0.5rem;filter:grayscale(1)">${badge.icon}</div>
      <div style="font-weight:700;font-size:0.9375rem;margin-bottom:4px;color:var(--text-secondary)">${badge.name}</div>
      <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.75rem;line-height:1.4">${badge.description}</div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
        <span class="tag tag-gray" style="font-size:0.7rem">🔒 Locked</span>
        <span class="tag tag-gray" style="font-size:0.65rem">+${badge.xp} XP</span>
      </div>
    </div>
  `;
}

function _formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}
