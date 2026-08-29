/* =========================================================
   Job Readiness Score Page
   ========================================================= */
import { navigateTo, el } from '../js/app.js';
import { calculateReadinessScore } from '../js/score.js';
import DATA from '../js/data.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });
  const readiness = calculateReadinessScore(appState);
  const { score, level, pillars, recommendations } = readiness;

  container.innerHTML = `
    <div class="page-header">
      <h1>📊 Job Readiness Score</h1>
      <p>Your comprehensive readiness score based on skills, resume quality, course completion, interview performance, and career clarity.</p>
    </div>

    <!-- Hero Score Card -->
    <div class="score-hero mb-6">
      <div class="score-circle" id="score-circle">
        <div class="score-big-number" id="animated-score">0</div>
        <div class="score-max">/ 100</div>
      </div>
      <div class="score-label">${level.label}</div>
      <div class="score-subtitle">Overall Job Readiness Score</div>
      <div style="display:flex;gap:1rem;justify-content:center;margin-top:1.25rem;flex-wrap:wrap">
        <span style="background:rgba(255,255,255,0.15);padding:5px 14px;border-radius:10px;font-size:0.8125rem">
          Grade: <strong>${level.tag}</strong>
        </span>
        <span style="background:rgba(255,255,255,0.15);padding:5px 14px;border-radius:10px;font-size:0.8125rem">
          Top ${getPercentile(score)}% of students
        </span>
      </div>
    </div>

    <!-- Pillar Breakdown -->
    <div class="grid grid-2 gap-5 mb-6">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🔍 Score Breakdown</div>
          <span class="tag tag-blue" style="font-size:0.7rem">5 pillars</span>
        </div>
        <div id="breakdown-list">
          ${Object.values(pillars).map(p => `
            <div class="score-breakdown-item">
              <div class="score-breakdown-icon" style="background:${p.color}22;color:${p.color}">
                ${p.icon}
              </div>
              <div class="score-breakdown-info">
                <div class="score-breakdown-name">${p.label}</div>
                <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">${p.detail}</div>
                <div class="progress-bar-wrap" style="height:6px">
                  <div class="progress-bar-fill" style="width:${p.score}%;background:${p.color}"></div>
                </div>
              </div>
              <div class="score-breakdown-value" style="color:${p.color}">${p.score}%</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Radar visualization -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🕸️ Readiness Radar</div>
        </div>
        <div id="readiness-radar" class="radar-wrap" style="min-height:280px"></div>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title">🎯 Personalized Action Plan</div>
        <span class="tag tag-purple" style="font-size:0.7rem">${recommendations.length} actions</span>
      </div>
      <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:1rem">
        Complete these actions to improve your Job Readiness Score:
      </p>
      <div style="display:flex;flex-direction:column;gap:0.75rem" class="stagger">
        ${recommendations.map((rec, i) => `
          <div class="rec-item">
            <div class="rec-priority priority-${rec.priority}">${i + 1}</div>
            <div class="rec-content">
              <div class="rec-title">${rec.title}</div>
              <div class="rec-desc">${rec.desc}</div>
            </div>
            <button class="btn btn-secondary btn-sm rec-action-btn" data-action="${rec.action}" style="flex-shrink:0">
              Go →
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Score History (if multiple interviews) -->
    <div id="score-history-section"></div>

    <!-- Share / Export -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">📤 Share Your Progress</div>
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center">
        <div style="flex:1">
          <div style="font-weight:500;margin-bottom:4px">Ready to share your achievement?</div>
          <div style="font-size:0.875rem;color:var(--text-secondary)">
            Your Job Readiness Score is <strong style="color:${level.color}">${score}%</strong> — ${level.label}
          </div>
        </div>
        <button class="btn btn-primary" id="copy-score-btn">📋 Copy Score Summary</button>
        <button class="btn btn-secondary" id="print-score-btn">🖨️ Print Report</button>
      </div>
    </div>
  `;

  return container;
}

export function onMount(appState) {
  const readiness = calculateReadinessScore(appState);
  const { score, level, pillars } = readiness;

  // Animate score counter
  animateCounter(document.getElementById('animated-score'), 0, score, 1200);

  // Draw radar
  import('../js/app.js').then(({ drawRadarChart }) => {
    const container = document.getElementById('readiness-radar');
    if (container) {
      const labels = Object.values(pillars).map(p => p.label.replace(' ', '\n'));
      const values = Object.values(pillars).map(p => p.score);
      drawRadarChart(container, labels, values, level.color);
    }
  });

  // Action plan buttons
  document.querySelectorAll('.rec-action-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.action));
  });

  // Copy score summary
  document.getElementById('copy-score-btn')?.addEventListener('click', () => {
    const text = generateScoreSummary(appState, readiness);
    navigator.clipboard.writeText(text).then(() => {
      import('../js/app.js').then(({ showToast }) => showToast('Score summary copied to clipboard!', 'success'));
    }).catch(() => {
      import('../js/app.js').then(({ showToast }) => showToast('Copy failed — please copy manually', 'warning'));
    });
  });

  document.getElementById('print-score-btn')?.addEventListener('click', () => window.print());

  // Score history
  renderScoreHistory();
}

function animateCounter(el, from, to, duration) {
  if (!el) return;
  const start = performance.now();
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function getPercentile(score) {
  if (score >= 90) return 5;
  if (score >= 75) return 15;
  if (score >= 60) return 30;
  if (score >= 45) return 55;
  return 80;
}

function generateScoreSummary(appState, readiness) {
  const { score, level, pillars } = readiness;
  return `
🎓 IBM AI Career Copilot — Job Readiness Report
${appState.profile?.name || 'Student'} | ${new Date().toLocaleDateString()}

Overall Score: ${score}/100 — ${level.tag}

Breakdown:
• Skills Profile: ${pillars.skills.score}% — ${pillars.skills.detail}
• Resume Quality: ${pillars.resume.score}% — ${pillars.resume.detail}
• Learning Progress: ${pillars.courses.score}% — ${pillars.courses.detail}
• Interview Readiness: ${pillars.interview.score}% — ${pillars.interview.detail}
• Career Clarity: ${pillars.career.score}% — ${pillars.career.detail}

Generated by IBM AI Career Copilot — skillsbuild.org
`.trim();
}

function renderScoreHistory() {
  import('../js/interview.js').then(({ getInterviewHistory }) => {
    const history = getInterviewHistory();
    const section = document.getElementById('score-history-section');
    if (!section || history.length === 0) return;

    // Build comparative bar chart SVG (up to 10 most recent, oldest → newest left to right)
    const chartData = history.slice(0, 10).reverse();
    const BAR_W = 36, BAR_GAP = 14, CHART_H = 120, LABEL_H = 36;
    const chartW = chartData.length * (BAR_W + BAR_GAP) + BAR_GAP;
    const barColor = (avg) => avg >= 70 ? '#24a148' : avg >= 50 ? '#ff832b' : '#da1e28';

    const bars = chartData.map((h, i) => {
      const avg = h.score?.avg || 0;
      const barH = Math.max(4, Math.round((avg / 100) * CHART_H));
      const x = BAR_GAP + i * (BAR_W + BAR_GAP);
      const y = CHART_H - barH;
      const color = barColor(avg);
      const career = DATA.careerPaths.find(c => c.id === h.careerId);
      const shortDate = new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      return `
        <rect x="${x}" y="${y}" width="${BAR_W}" height="${barH}" rx="3" fill="${color}" opacity="0.85"/>
        <text x="${x + BAR_W / 2}" y="${y - 5}" text-anchor="middle" font-size="10" font-weight="700" fill="${color}" font-family="IBM Plex Sans,system-ui,sans-serif">${avg}%</text>
        <text x="${x + BAR_W / 2}" y="${CHART_H + 14}" text-anchor="middle" font-size="9" fill="#525252" font-family="IBM Plex Sans,system-ui,sans-serif">${career?.emoji || '🤖'}</text>
        <text x="${x + BAR_W / 2}" y="${CHART_H + 26}" text-anchor="middle" font-size="8" fill="#8d8d8d" font-family="IBM Plex Sans,system-ui,sans-serif">${shortDate}</text>
      `;
    }).join('');

    // Horizontal guide lines at 25/50/75/100%
    const guides = [25, 50, 75, 100].map(pct => {
      const y = CHART_H - Math.round((pct / 100) * CHART_H);
      return `
        <line x1="0" y1="${y}" x2="${chartW}" y2="${y}" stroke="#e0e0e0" stroke-width="1" stroke-dasharray="${pct === 100 ? '0' : '3,3'}"/>
        <text x="2" y="${y - 3}" font-size="8" fill="#c6c6c6" font-family="IBM Plex Sans,system-ui,sans-serif">${pct}%</text>
      `;
    }).join('');

    const trendLine = chartData.length > 1 ? (() => {
      const points = chartData.map((h, i) => {
        const avg = h.score?.avg || 0;
        const x = BAR_GAP + i * (BAR_W + BAR_GAP) + BAR_W / 2;
        const y = CHART_H - Math.max(4, Math.round((avg / 100) * CHART_H));
        return `${x},${y}`;
      }).join(' ');
      return `<polyline points="${points}" fill="none" stroke="#0f62fe" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.6"/>`;
    })() : '';

    const chartSvg = `
      <svg viewBox="0 0 ${chartW} ${CHART_H + LABEL_H}" xmlns="http://www.w3.org/2000/svg"
        style="width:100%;max-width:${chartW}px;display:block;overflow:visible">
        ${guides}
        ${bars}
        ${trendLine}
      </svg>
    `;

    section.innerHTML = `
      <div class="card mb-6">
        <div class="card-header">
          <div class="card-title">📈 Interview Performance History</div>
          <span style="font-size:0.75rem;color:var(--text-secondary)">${history.length} session${history.length !== 1 ? 's' : ''} · most recent last</span>
        </div>

        <!-- Comparative bar chart -->
        <div style="padding:0.75rem 0 1.25rem;overflow-x:auto">
          ${chartSvg}
        </div>

        <!-- Row list -->
        <div style="border-top:1px solid var(--ui-03);padding-top:0.75rem">
          ${history.map((h, idx) => {
            const career = DATA.careerPaths.find(c => c.id === h.careerId);
            const avg = h.score?.avg || 0;
            const color = barColor(avg);
            const typeBadge = h.type ? (h.type.charAt(0).toUpperCase() + h.type.slice(1)) : 'Mixed';
            // Trend vs previous session
            const prevAvg = history[idx + 1]?.score?.avg;
            const trendIcon = prevAvg == null ? '' : avg > prevAvg ? ' <span style="color:#24a148;font-size:0.75rem">▲</span>' : avg < prevAvg ? ' <span style="color:#da1e28;font-size:0.75rem">▼</span>' : ' <span style="color:#8d8d8d;font-size:0.75rem">–</span>';
            return `
              <div style="display:flex;align-items:center;gap:1rem;padding:0.625rem 0;border-bottom:1px solid var(--ui-03)">
                <div style="font-size:1.25rem;flex-shrink:0">${career?.emoji || '🤖'}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:500;font-size:0.875rem;display:flex;align-items:center;gap:0.375rem;flex-wrap:wrap">
                    ${career?.title || h.careerId}
                    <span style="font-size:0.65rem;font-weight:600;padding:1px 6px;border-radius:10px;background:#e8e8e8;color:#525252">${typeBadge}</span>
                  </div>
                  <div style="font-size:0.75rem;color:var(--text-secondary)">${new Date(h.date).toLocaleDateString()} · ${h.questionCount} Qs · ${h.score?.answered || 0} answered</div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div style="font-size:1.25rem;font-weight:700;color:${color}">${avg}%${trendIcon}</div>
                  <div style="font-size:0.7rem;color:var(--text-secondary)">avg score</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });
}
