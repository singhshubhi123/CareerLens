const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-PtNS_aXy.js","assets/rolldown-runtime-DK3Fl9T5.js","assets/index-DycPD6sQ.css","assets/interview-BsBhX070.js","assets/data-B5kr3qfV.js"])))=>i.map(i=>d[i]);
import{i as e,r as t,s as n}from"./index-PtNS_aXy.js";import{t as r}from"./data-B5kr3qfV.js";import{t as i}from"./score-CFRowX0_.js";function a(e){let n=t(`div`,{className:`animate-in`}),{score:r,level:a,pillars:o,recommendations:s}=i(e);return n.innerHTML=`
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
      <div class="score-label">${a.label}</div>
      <div class="score-subtitle">Overall Job Readiness Score</div>
      <div style="display:flex;gap:1rem;justify-content:center;margin-top:1.25rem;flex-wrap:wrap">
        <span style="background:rgba(255,255,255,0.15);padding:5px 14px;border-radius:10px;font-size:0.8125rem">
          Grade: <strong>${a.tag}</strong>
        </span>
        <span style="background:rgba(255,255,255,0.15);padding:5px 14px;border-radius:10px;font-size:0.8125rem">
          Top ${c(r)}% of students
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
          ${Object.values(o).map(e=>`
            <div class="score-breakdown-item">
              <div class="score-breakdown-icon" style="background:${e.color}22;color:${e.color}">
                ${e.icon}
              </div>
              <div class="score-breakdown-info">
                <div class="score-breakdown-name">${e.label}</div>
                <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:4px">${e.detail}</div>
                <div class="progress-bar-wrap" style="height:6px">
                  <div class="progress-bar-fill" style="width:${e.score}%;background:${e.color}"></div>
                </div>
              </div>
              <div class="score-breakdown-value" style="color:${e.color}">${e.score}%</div>
            </div>
          `).join(``)}
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
        <span class="tag tag-purple" style="font-size:0.7rem">${s.length} actions</span>
      </div>
      <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:1rem">
        Complete these actions to improve your Job Readiness Score:
      </p>
      <div style="display:flex;flex-direction:column;gap:0.75rem" class="stagger">
        ${s.map((e,t)=>`
          <div class="rec-item">
            <div class="rec-priority priority-${e.priority}">${t+1}</div>
            <div class="rec-content">
              <div class="rec-title">${e.title}</div>
              <div class="rec-desc">${e.desc}</div>
            </div>
            <button class="btn btn-secondary btn-sm rec-action-btn" data-action="${e.action}" style="flex-shrink:0">
              Go →
            </button>
          </div>
        `).join(``)}
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
            Your Job Readiness Score is <strong style="color:${a.color}">${r}%</strong> — ${a.label}
          </div>
        </div>
        <button class="btn btn-primary" id="copy-score-btn">📋 Copy Score Summary</button>
        <button class="btn btn-secondary" id="print-score-btn">🖨️ Print Report</button>
      </div>
    </div>
  `,n}function o(t){let r=i(t),{score:a,level:o,pillars:c}=r;s(document.getElementById(`animated-score`),0,a,1200),n(async()=>{let{drawRadarChart:e}=await import(`./index-PtNS_aXy.js`).then(e=>e.t);return{drawRadarChart:e}},__vite__mapDeps([0,1,2])).then(({drawRadarChart:e})=>{let t=document.getElementById(`readiness-radar`);t&&e(t,Object.values(c).map(e=>e.label.replace(` `,`
`)),Object.values(c).map(e=>e.score),o.color)}),document.querySelectorAll(`.rec-action-btn`).forEach(t=>{t.addEventListener(`click`,()=>e(t.dataset.action))}),document.getElementById(`copy-score-btn`)?.addEventListener(`click`,()=>{let e=l(t,r);navigator.clipboard.writeText(e).then(()=>{n(async()=>{let{showToast:e}=await import(`./index-PtNS_aXy.js`).then(e=>e.t);return{showToast:e}},__vite__mapDeps([0,1,2])).then(({showToast:e})=>e(`Score summary copied to clipboard!`,`success`))}).catch(()=>{n(async()=>{let{showToast:e}=await import(`./index-PtNS_aXy.js`).then(e=>e.t);return{showToast:e}},__vite__mapDeps([0,1,2])).then(({showToast:e})=>e(`Copy failed — please copy manually`,`warning`))})}),document.getElementById(`print-score-btn`)?.addEventListener(`click`,()=>window.print()),u()}function s(e,t,n,r){if(!e)return;let i=performance.now(),a=o=>{let s=o-i,c=Math.min(s/r,1),l=1-(1-c)**3;e.textContent=Math.round(t+(n-t)*l),c<1&&requestAnimationFrame(a)};requestAnimationFrame(a)}function c(e){return e>=90?5:e>=75?15:e>=60?30:e>=45?55:80}function l(e,t){let{score:n,level:r,pillars:i}=t;return`
🎓 IBM AI Career Copilot — Job Readiness Report
${e.profile?.name||`Student`} | ${new Date().toLocaleDateString()}

Overall Score: ${n}/100 — ${r.tag}

Breakdown:
• Skills Profile: ${i.skills.score}% — ${i.skills.detail}
• Resume Quality: ${i.resume.score}% — ${i.resume.detail}
• Learning Progress: ${i.courses.score}% — ${i.courses.detail}
• Interview Readiness: ${i.interview.score}% — ${i.interview.detail}
• Career Clarity: ${i.career.score}% — ${i.career.detail}

Generated by IBM AI Career Copilot — skillsbuild.org
`.trim()}function u(){n(async()=>{let{getInterviewHistory:e}=await import(`./interview-BsBhX070.js`).then(e=>e.i);return{getInterviewHistory:e}},__vite__mapDeps([3,1,4])).then(({getInterviewHistory:e})=>{let t=e(),n=document.getElementById(`score-history-section`);!n||t.length===0||(n.innerHTML=`
      <div class="card mb-6">
        <div class="card-header">
          <div class="card-title">📈 Interview Performance History</div>
        </div>
        <div>
          ${t.map(e=>{let t=r.careerPaths.find(t=>t.id===e.careerId),n=(e.score?.avg||0)>=70?`var(--ibm-green)`:(e.score?.avg||0)>=50?`var(--ibm-orange)`:`var(--ibm-red)`;return`
              <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem 0;border-bottom:1px solid var(--ui-03)">
                <div style="font-size:1.5rem">${t?.emoji||`🤖`}</div>
                <div style="flex:1">
                  <div style="font-weight:500;font-size:0.9375rem">${t?.title||e.careerId}</div>
                  <div style="font-size:0.8125rem;color:var(--text-secondary)">
                    ${new Date(e.date).toLocaleDateString()} · ${e.questionCount} questions · ${e.score?.answered||0} answered
                  </div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:1.5rem;font-weight:700;color:${n}">${e.score?.avg||0}%</div>
                  <div style="font-size:0.75rem;color:var(--text-secondary)">avg score</div>
                </div>
                <div style="width:80px">
                  <div class="progress-bar-wrap" style="height:6px">
                    <div class="progress-bar-fill" style="width:${e.score?.avg||0}%;background:${n}"></div>
                  </div>
                </div>
              </div>
            `}).join(``)}
        </div>
      </div>
    `)})}export{o as onMount,a as render};