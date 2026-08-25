import{a as e,i as t,o as n,r}from"./index-PtNS_aXy.js";import{generateRoadmap as i}from"./roadmap-4DP8u1bW.js";function a(t){let n=r(`div`,{className:`animate-in`});if(t.selectedCareers.length===0)return n.innerHTML=`
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
    `,n;(!t.roadmap||!t.roadmap.careerId||!t.selectedCareers.includes(t.roadmap.careerId))&&(t.roadmap=i(t.selectedCareers,t.profile?.skills||[],t.profile?.experience||0),e());let a=t.roadmap,o=a.phases.flatMap(e=>e.milestones).length,c=a.phases.flatMap(e=>e.milestones).filter(e=>e.done).length,l=o>0?Math.round(c/o*100):0;return n.innerHTML=`
    <div class="page-header">
      <h1>🗺️ Learning Roadmap</h1>
      <p>Your personalized path to becoming a <strong>${a.careerTitle}</strong>. Total duration: ~${a.totalDuration}.</p>
    </div>

    <!-- Progress Overview -->
    <div class="card mb-6">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
        <div>
          <div style="font-size:1.125rem;font-weight:600">Overall Progress</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">${c} of ${o} milestones completed</div>
        </div>
        <div style="font-size:1.75rem;font-weight:700;color:var(--ibm-blue)">${l}%</div>
      </div>
      <div class="progress-bar-wrap" style="height:12px">
        <div class="progress-bar-fill" id="overall-bar" style="width:${l}%;background:linear-gradient(90deg,#0f62fe,#6929c4)"></div>
      </div>
      <div style="display:flex;gap:1rem;margin-top:1rem;flex-wrap:wrap">
        ${a.phases.map(e=>{let t=e.milestones.filter(e=>e.done).length,n=e.milestones.length,r=n>0?Math.round(t/n*100):0;return`
            <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem">
              <div style="width:10px;height:10px;border-radius:50%;background:${e.color}"></div>
              <span style="color:var(--text-secondary)">${e.label}: ${r}%</span>
            </div>
          `}).join(``)}
      </div>
    </div>

    <!-- Phases Timeline -->
    <div class="roadmap-timeline" id="roadmap-phases">
      ${a.phases.map((e,t)=>s(e,t)).join(``)}
    </div>

    <!-- Action Row -->
    <div class="flex gap-3 mt-6 flex-wrap">
      <button class="btn btn-primary" id="goto-courses-btn">🎓 View Recommended Courses</button>
      <button class="btn btn-secondary" id="goto-interview-btn">🤖 Practice Mock Interview</button>
      <button class="btn btn-ghost" id="regenerate-btn">🔄 Regenerate Roadmap</button>
    </div>
  `,n}function o(r){document.getElementById(`go-careers-btn`)?.addEventListener(`click`,()=>t(`careers`)),document.getElementById(`goto-courses-btn`)?.addEventListener(`click`,()=>t(`courses`)),document.getElementById(`goto-interview-btn`)?.addEventListener(`click`,()=>t(`interview`)),document.getElementById(`regenerate-btn`)?.addEventListener(`click`,()=>{r.roadmap=null,e(),t(`roadmap`),n(`Roadmap regenerated!`,`success`)}),document.querySelectorAll(`.milestone-check`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.phase,n=e.dataset.id;c(r,t,n)})}),document.querySelectorAll(`.phase-toggle`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.roadmap-phase`).querySelector(`.phase-items`),n=t.style.display===`none`;t.style.display=n?``:`none`,e.textContent=n?`▼`:`▶`})})}function s(e,t){let n=e.milestones.filter(e=>e.done).length,r=e.milestones.length,i=r>0?Math.round(n/r*100):0,a=i===100;return`
    <div class="roadmap-phase ${a?`completed`:``}" 
      style="--phase-color:${e.color}">
      
      <div class="phase-header">
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem">
            <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${e.color}">${e.label}</span>
            ${a?`<span class="tag tag-green" style="font-size:0.65rem">✓ Complete</span>`:``}
          </div>
          <div class="phase-title">${e.title}</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:2px">${e.description}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="phase-duration">${e.duration}</div>
          <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px">${n}/${r} done</div>
          <button class="phase-toggle btn btn-ghost btn-sm" style="margin-top:4px">▼</button>
        </div>
      </div>

      <!-- Phase progress bar -->
      <div class="progress-bar-wrap mb-3" style="height:4px">
        <div class="progress-bar-fill" style="width:${i}%;background:${e.color}"></div>
      </div>

      <div class="phase-items">
        <!-- Skills to learn -->
        ${e.skills.length>0?`
          <div style="margin-bottom:0.75rem">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">Skills to Learn</div>
            <div class="skill-tag-list">
              ${e.skills.map(e=>`<span class="skill-chip missing">${e}</span>`).join(``)}
            </div>
          </div>
        `:``}

        <!-- Recommended courses in this phase -->
        ${e.courses.length>0?`
          <div style="margin-bottom:0.75rem">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">Recommended Courses</div>
            ${e.courses.map(e=>`
              <div class="phase-item" style="justify-content:space-between;margin-bottom:0.375rem">
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <span style="font-size:1rem">🎓</span>
                  <div>
                    <div style="font-size:0.875rem;font-weight:500">${e.title}</div>
                    <div style="font-size:0.75rem;color:var(--text-secondary)">${e.duration} · ${e.level} ${e.free?`· Free`:``}</div>
                  </div>
                </div>
                ${e.badge?`<span class="tag tag-purple" style="font-size:0.65rem">${e.badge}</span>`:``}
              </div>
            `).join(``)}
          </div>
        `:``}

        <!-- Milestones checklist -->
        <div>
          <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">Milestones</div>
          ${e.milestones.map(t=>`
            <div class="phase-item" style="gap:0.75rem">
              <div class="phase-item-check milestone-check ${t.done?`checked`:``}" 
                data-phase="${e.id}" data-id="${t.id}">
                ${t.done?`<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`:``}
              </div>
              <span style="${t.done?`text-decoration:line-through;color:var(--text-secondary)`:``}">${t.text}</span>
            </div>
          `).join(``)}
        </div>
      </div>
    </div>
  `}function c(t,r,i){if(!t.roadmap)return;let a=t.roadmap.phases.find(e=>e.id===r);if(!a)return;let o=a.milestones.find(e=>e.id===i);if(!o)return;o.done=!o.done,e();let s=document.querySelector(`.milestone-check[data-phase="${r}"][data-id="${i}"]`);if(s){s.classList.toggle(`checked`,o.done),s.innerHTML=o.done?`<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`:``;let e=s.nextElementSibling;e&&(e.style.cssText=o.done?`text-decoration:line-through;color:var(--text-secondary)`:``)}let c=t.roadmap.phases.flatMap(e=>e.milestones).length,l=t.roadmap.phases.flatMap(e=>e.milestones).filter(e=>e.done).length,u=c>0?Math.round(l/c*100):0,d=document.getElementById(`overall-bar`);d&&(d.style.width=u+`%`),o.done&&n(`Milestone completed! 🎉`,`success`)}export{o as onMount,a as render};