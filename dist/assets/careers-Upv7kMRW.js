const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/data-B5kr3qfV.js","assets/rolldown-runtime-DK3Fl9T5.js","assets/roadmap-4DP8u1bW.js","assets/recommender-C8-l-Jal.js"])))=>i.map(i=>d[i]);
import{a as e,i as t,o as n,r,s as i}from"./index-PtNS_aXy.js";import{n as a}from"./recommender-C8-l-Jal.js";function o(e){let t=r(`div`,{className:`animate-in`}),n=a(e.profile?.skills||[]);return t.innerHTML=`
    <div class="page-header">
      <h1>🚀 Career Path Recommender</h1>
      <p>AI-matched career paths based on your skills and experience. Select up to 2 paths to personalize your roadmap.</p>
    </div>

    <!-- Selected banner -->
    <div id="selection-banner" class="${e.selectedCareers.length===0?`hidden`:``}">
      <div class="card mb-4" style="border-color:var(--ibm-blue);background:#f0f5ff">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
          <div>
            <div style="font-weight:600">✅ Career paths selected</div>
            <div style="font-size:0.875rem;color:var(--text-secondary);margin-top:2px">
              ${e.selectedCareers.map(e=>n.find(t=>t.id===e)?.title).filter(Boolean).join(` + `)}
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
      <button class="filter-tab active" data-filter="all">All Paths (${n.length})</button>
      <button class="filter-tab" data-filter="very-high">🔥 Very High Demand</button>
      <button class="filter-tab" data-filter="high">📈 High Demand</button>
      ${e.profile?`<button class="filter-tab" data-filter="best-match">⭐ Best Match</button>`:``}
    </div>

    <!-- Career grid -->
    <div class="grid grid-auto stagger" id="careers-grid">
      ${c(n,e.selectedCareers)}
    </div>

    <!-- Detail Modal -->
    <div id="career-detail-panel" class="hidden"></div>
  `,t}function s(e){document.getElementById(`goto-roadmap-btn`)?.addEventListener(`click`,()=>{p(e,`roadmap`)}),document.getElementById(`goto-courses-btn`)?.addEventListener(`click`,()=>t(`courses`)),document.querySelectorAll(`[data-filter]`).forEach(t=>{t.addEventListener(`click`,()=>{document.querySelectorAll(`[data-filter]`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),d(t.dataset.filter,e)})}),l(e)}function c(e,t){return e.map(e=>`
    <div class="career-card ${t.includes(e.id)?`selected`:``}" 
      data-career-id="${e.id}" 
      style="--career-color:${e.color}; cursor:pointer">

      <!-- Match indicator -->
      ${t.includes(e.id)?`<div style="position:absolute;top:12px;right:12px;background:var(--ibm-blue);color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700">✓</div>`:``}

      <div class="career-icon">${e.emoji}</div>
      <div class="career-title">${e.title}</div>
      <div class="career-desc">${e.description}</div>

      <!-- Match bar -->
      <div style="margin-bottom:0.75rem">
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:4px">
          <span style="color:var(--text-secondary)">Skill Match</span>
          <span class="career-match ${e.matchScore>=60?`match-high`:e.matchScore>=35?`match-medium`:`match-low`}"
            style="font-weight:700">${e.matchScore}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width:${e.matchScore}%;background:${e.color}"></div>
        </div>
      </div>

      <div class="career-meta">
        <div style="display:flex;flex-direction:column;gap:4px;width:100%">
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tag tag-blue" style="font-size:0.7rem">${e.demandLevel} Demand</span>
            <span class="tag tag-green" style="font-size:0.7rem">📈 ${e.growth}</span>
          </div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">${e.salaryRange}/yr</div>
        </div>
      </div>

      <!-- Skill gaps preview -->
      <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--ui-03)">
        <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.375rem">
          Skill gaps: ${e.gaps.missing.length} critical
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${e.gaps.missing.slice(0,3).map(e=>`<span class="tag tag-red" style="font-size:0.65rem">${e}</span>`).join(``)}
          ${e.gaps.missing.length>3?`<span class="tag tag-gray" style="font-size:0.65rem">+${e.gaps.missing.length-3} more</span>`:``}
        </div>
      </div>

      <!-- Action row -->
      <div style="margin-top:1rem;display:flex;gap:0.5rem">
        <button class="btn btn-sm ${t.includes(e.id)?`btn-danger`:`btn-primary`} flex-1 select-career-btn" 
          data-id="${e.id}">
          ${t.includes(e.id)?`✓ Selected`:`+ Select Path`}
        </button>
        <button class="btn btn-secondary btn-sm detail-btn" data-id="${e.id}">Details</button>
      </div>
    </div>
  `).join(``)}function l(e){document.querySelectorAll(`.select-career-btn`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation();let r=t.dataset.id;u(r,e)})}),document.querySelectorAll(`.detail-btn`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation(),f(t.dataset.id,e)})})}function u(r,i){if(i.selectedCareers.includes(r))i.selectedCareers=i.selectedCareers.filter(e=>e!==r),n(`Career path removed`,`info`);else{if(i.selectedCareers.length>=2){n(`You can select up to 2 career paths`,`warning`);return}i.selectedCareers.push(r),n(`Career path selected! 🎯`,`success`)}e(),t(`careers`)}function d(e,t){let n=a(t.profile?.skills||[]),r=document.getElementById(`careers-grid`);if(!r)return;let i;i=e===`very-high`?n.filter(e=>e.demandLevel===`Very High`):e===`high`?n.filter(e=>e.demandLevel===`High`):e===`best-match`?n.filter(e=>e.matchScore>=40):n,r.innerHTML=c(i,t.selectedCareers),l(t)}function f(e,t){i(async()=>{let{default:e}=await import(`./data-B5kr3qfV.js`).then(e=>e.n);return{default:e}},__vite__mapDeps([0,1])).then(({default:n})=>{let r=n.careerPaths.find(t=>t.id===e);if(!r)return;let i=document.getElementById(`career-detail-panel`);if(!i)return;i.classList.remove(`hidden`),i.innerHTML=`
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:1rem" id="modal-overlay">
        <div class="card card-lg" style="max-width:600px;width:100%;max-height:80vh;overflow-y:auto;position:relative;animation:fadeIn 0.2s ease">
          <button id="close-modal" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-secondary)">×</button>
          <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem">
            <div style="font-size:3rem">${r.emoji}</div>
            <div>
              <div style="font-size:1.375rem;font-weight:700">${r.title}</div>
              <div style="font-size:0.875rem;color:var(--text-secondary)">${r.salaryRange} · ${r.demandLevel} Demand · ${r.growth} growth</div>
            </div>
          </div>
          <p style="font-size:0.9375rem;color:var(--text-secondary);margin-bottom:1.5rem;line-height:1.6">${r.description}</p>

          <div class="mb-4">
            <div style="font-weight:600;margin-bottom:0.5rem">🔑 Required Skills</div>
            <div class="skill-tag-list">
              ${r.requiredSkills.map(e=>{let n=t.profile?.skills?.map(e=>e.toLowerCase()).includes(e.toLowerCase());return`<span class="skill-chip ${n?`strong`:`missing`}">${n?`✓ `:``}${e}</span>`}).join(``)}
            </div>
          </div>

          <div class="mb-4">
            <div style="font-weight:600;margin-bottom:0.5rem">⭐ Nice-to-Have Skills</div>
            <div class="skill-tag-list">
              ${r.niceToHave.map(e=>`<span class="skill-chip partial">${e}</span>`).join(``)}
            </div>
          </div>

          <div class="mb-4">
            <div style="font-weight:600;margin-bottom:0.5rem">📈 Career Ladder</div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">
              ${r.roles.map((e,t)=>`
                <span style="font-size:0.8125rem;background:var(--ui-02);padding:4px 10px;border-radius:12px">${e}</span>
                ${t<r.roles.length-1?`<span style="color:var(--text-secondary)">→</span>`:``}
              `).join(``)}
            </div>
          </div>

          <div>
            <div style="font-weight:600;margin-bottom:0.5rem">🏢 Companies Hiring</div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
              ${r.companies.map(e=>`<span class="tag tag-blue">${e}</span>`).join(``)}
            </div>
          </div>

          <div style="display:flex;gap:0.75rem;margin-top:1.5rem">
            <button class="btn btn-primary flex-1" id="select-from-detail" data-id="${r.id}">
              ${t.selectedCareers.includes(r.id)?`✓ Selected`:`+ Select This Path`}
            </button>
            <button class="btn btn-secondary" id="close-modal-btn">Close</button>
          </div>
        </div>
      </div>
    `;let a=()=>{i.classList.add(`hidden`),i.innerHTML=``};document.getElementById(`close-modal`)?.addEventListener(`click`,a),document.getElementById(`close-modal-btn`)?.addEventListener(`click`,a),document.getElementById(`modal-overlay`)?.addEventListener(`click`,e=>{e.target.id===`modal-overlay`&&a()}),document.getElementById(`select-from-detail`)?.addEventListener(`click`,()=>{a(),u(e,t)})})}function p(n,r){i(async()=>{let{generateRoadmap:e}=await import(`./roadmap-4DP8u1bW.js`);return{generateRoadmap:e}},__vite__mapDeps([2,0,1,3])).then(({generateRoadmap:i})=>{n.roadmap=i(n.selectedCareers,n.profile?.skills||[],n.profile?.experience||0),e(),t(r)})}export{s as onMount,o as render};