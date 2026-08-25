import{a as e,i as t,n,r}from"./index-PtNS_aXy.js";import{n as i,t as a}from"./recommender-C8-l-Jal.js";function o(e){let t=r(`div`,{className:`animate-in`});if(!e.profile)return t.innerHTML=`
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
    `,t;let n=i(e.profile.skills),o=e.selectedCareers.length>0?e.selectedCareers:[n[0]?.id].filter(Boolean),s=a(o,e.profile.skills),l=n.find(e=>o.includes(e.id))||n[0],u=s.filter(e=>e.userHas),d=s.filter(e=>!e.userHas&&e.requiredBy>0),f=s.filter(e=>!e.userHas&&e.requiredBy===0);return t.innerHTML=`
    <div class="page-header">
      <h1>⚡ Skill Gap Analyzer</h1>
      <p>Comparing your skills against the requirements for <strong>${l?.title||`your selected careers`}</strong>.</p>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-4 mb-6 stagger">
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Skills You Have</div>
        <div class="stat-value" style="color:var(--ibm-green)">${u.length}</div>
        <div class="stat-desc">out of ${s.length} required</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-red)">
        <div class="stat-label">Critical Gaps</div>
        <div class="stat-value" style="color:var(--ibm-red)">${d.length}</div>
        <div class="stat-desc">required skills missing</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-yellow)">
        <div class="stat-label">Nice-to-Haves</div>
        <div class="stat-value" style="color:var(--ibm-orange)">${f.length}</div>
        <div class="stat-desc">bonus skills to learn</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-blue)">
        <div class="stat-label">Coverage</div>
        <div class="stat-value" style="color:var(--ibm-blue)">${s.length>0?Math.round(u.length/s.length*100):0}%</div>
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
        ${n.slice(0,5).map(e=>`
          <button class="filter-tab ${o.includes(e.id)?`active`:``}" 
            data-career="${e.id}" style="--career-color:${e.color}">
            ${e.emoji} ${e.title} <span style="opacity:0.75">(${e.matchScore}%)</span>
          </button>
        `).join(``)}
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
          ${c(s.slice(0,10))}
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
    ${d.length>0?`
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title">🚨 Critical Skill Gaps (Required)</div>
        <span class="tag tag-red">${d.length} missing</span>
      </div>
      <p style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1rem">
        These are the required skills you currently lack. Closing these gaps will significantly improve your job readiness.
      </p>
      <div class="skill-tag-list">
        ${d.map(e=>`
          <span class="skill-chip missing" title="${e.requiredBy} career(s) require this skill">
            ${e.skill} <span style="font-size:0.7rem;opacity:0.75">×${e.requiredBy}</span>
          </span>
        `).join(``)}
      </div>
      <div class="mt-4">
        <button class="btn btn-primary btn-sm" id="find-courses-btn">🎓 Find Courses for These Skills →</button>
      </div>
    </div>
    `:`
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
        <span class="tag tag-green">${u.length} skills</span>
      </div>
      <div class="skill-tag-list">
        ${u.length>0?u.map(e=>`<span class="skill-chip strong">${e.skill}</span>`).join(``):`<p style="color:var(--text-secondary);font-size:0.875rem">No matching skills detected yet. Upload your resume or add skills manually.</p>`}
      </div>
    </div>

    <!-- Nice to have -->
    ${f.length>0?`
    <div class="card">
      <div class="card-header">
        <div class="card-title">⭐ Nice-to-Have Skills</div>
        <span class="tag tag-yellow">${f.length} skills</span>
      </div>
      <p style="font-size:0.8125rem;color:var(--text-secondary);margin-bottom:1rem">
        These aren't required, but having them will make you a stronger candidate.
      </p>
      <div class="skill-tag-list">
        ${f.map(e=>`<span class="skill-chip partial">${e.skill}</span>`).join(``)}
      </div>
    </div>
    `:``}
  `,t}function s(n){document.getElementById(`go-resume-btn`)?.addEventListener(`click`,()=>t(`resume`)),document.getElementById(`change-career-btn`)?.addEventListener(`click`,()=>t(`careers`)),document.getElementById(`find-courses-btn`)?.addEventListener(`click`,()=>t(`courses`)),document.querySelectorAll(`[data-career]`).forEach(r=>{r.addEventListener(`click`,()=>{let i=r.dataset.career;n.selectedCareers=n.selectedCareers.includes(i)?[]:[i],e(),t(`skills`)})}),l(n)}function c(e){return e.length===0?`<p style="color:var(--text-secondary);font-size:0.875rem;padding:1rem 0">No skill data available.</p>`:e.map(t=>{let n=Math.min(100,t.importance/(e[0].importance||1)*100),r=t.userHas?`var(--ibm-green)`:`var(--ibm-red)`;return`
      <div class="skill-gap-row">
        <div class="skill-gap-name">${t.skill}</div>
        <div class="skill-gap-bar">
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${n}%;background:${r}"></div>
          </div>
        </div>
        <div class="skill-gap-status">
          ${t.userHas?`<span class="tag tag-green" style="font-size:0.7rem">✓ Have</span>`:`<span class="tag tag-red" style="font-size:0.7rem">✗ Gap</span>`}
        </div>
      </div>
    `}).join(``)}function l(e){let t=document.getElementById(`radar-container`);if(!t||!e.profile)return;let r=[{label:`Programming`,skills:[`Python`,`JavaScript`,`Java`,`TypeScript`,`SQL`]},{label:`Web/API`,skills:[`React`,`Node.js`,`REST APIs`,`HTML/CSS`,`GraphQL`]},{label:`Data/AI`,skills:[`Machine Learning`,`Pandas`,`TensorFlow`,`Data Visualization`,`Statistics`]},{label:`Cloud/DevOps`,skills:[`Docker`,`Kubernetes`,`AWS`,`CI/CD`,`Linux`]},{label:`Soft Skills`,skills:[`Communication`,`Problem Solving`,`Agile/Scrum`,`Leadership`]},{label:`Security`,skills:[`Network Security`,`Cryptography`,`OWASP`,`SIEM`]}],i=new Set(e.profile.skills.map(e=>e.toLowerCase())),a=r.map(e=>{let t=e.skills.filter(e=>i.has(e.toLowerCase())).length;return Math.round(t/e.skills.length*100)});n(t,r.map(e=>e.label),a,`#6929c4`)}export{s as onMount,o as render};