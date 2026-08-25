const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/recommender-C8-l-Jal.js","assets/rolldown-runtime-DK3Fl9T5.js","assets/data-B5kr3qfV.js"])))=>i.map(i=>d[i]);
import{i as e,n as t,r as n,s as r}from"./index-PtNS_aXy.js";import{t as i}from"./score-CFRowX0_.js";function a(e){let t=n(`div`,{className:`animate-in`}),r=i(e),a=!!e.profile,o=e.selectedCareers.length>0,c=!!e.roadmap;return t.innerHTML=`
    <!-- Welcome Banner -->
    <div class="dashboard-welcome">
      <div class="welcome-text">
        <h2>Welcome back, ${e.profile?.name||`Student`}! 👋</h2>
        <p>Your AI Career Copilot is ready. Let's land your dream job together.</p>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;">
          <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:12px;font-size:0.8125rem;">
            🎯 Job Readiness: <strong>${r.score}%</strong>
          </div>
          <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:12px;font-size:0.8125rem;">
            ⚡ ${e.profile?.skills?.length||0} skills detected
          </div>
          <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:12px;font-size:0.8125rem;">
            🎓 ${e.completedCourses?.length||0} courses completed
          </div>
        </div>
      </div>
      <div class="welcome-action">
        <button class="btn btn-lg" style="background:#fff;color:#0f62fe;font-weight:700;" 
          id="dash-cta-btn">
          ${a?o?`🤖 Start Interview`:`🧭 Choose Career`:`📄 Analyze Resume`}
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-4 mb-6 stagger">
      <div class="stat-card" style="--accent-color:${r.pillars.skills.color}">
        <div class="stat-label">Skills Detected</div>
        <div class="stat-value">${e.profile?.skills?.length||0}</div>
        <div class="stat-desc">${e.profile?`From your resume analysis`:`Upload your resume to start`}</div>
      </div>
      <div class="stat-card" style="--accent-color:#0f62fe">
        <div class="stat-label">Job Readiness Score</div>
        <div class="stat-value" style="color:${r.level.color}">${r.score}<span style="font-size:1.25rem">%</span></div>
        <div class="stat-desc">${r.level.label}</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-teal)">
        <div class="stat-label">Courses Completed</div>
        <div class="stat-value">${e.completedCourses?.length||0}</div>
        <div class="stat-desc">of 15 IBM SkillsBuild courses</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Career Paths</div>
        <div class="stat-value">${e.selectedCareers?.length||0}</div>
        <div class="stat-desc">target path${e.selectedCareers?.length===1?``:`s`} selected</div>
      </div>
    </div>

    <!-- 2-col section -->
    <div class="grid grid-2 gap-5 mb-6">
      <!-- Journey Checklist -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ Your Career Journey</div>
          <span class="tag tag-blue" style="font-size:0.7rem">${s([a,o,c])}/5 complete</span>
        </div>
        <div class="progress-tracker" id="step-list"></div>
      </div>

      <!-- Radar Chart -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Readiness Breakdown</div>
        </div>
        <div id="radar-chart-wrap" class="radar-wrap" style="padding:1rem;min-height:220px;"></div>
      </div>
    </div>

    <!-- Top Career Matches -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title">🚀 Top Career Matches</div>
        <button class="btn btn-ghost btn-sm" id="view-all-careers">View All →</button>
      </div>
      <div class="grid grid-3 stagger" id="top-careers-grid">
        <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-secondary)">
          ${a?`Loading matches…`:`📄 Analyze your resume to unlock career recommendations`}
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">⚡ Quick Actions</div>
      </div>
      <div class="grid grid-4 stagger" id="quick-actions"></div>
    </div>
  `,t}function o(t){document.getElementById(`dash-cta-btn`)?.addEventListener(`click`,()=>{let n=!!t.profile,r=t.selectedCareers.length>0;e(n?r?`interview`:`careers`:`resume`)}),document.getElementById(`view-all-careers`)?.addEventListener(`click`,()=>e(`careers`)),c(t),l(t),u(t),d(t)}function s(e){return e.filter(Boolean).length}function c(t){let r=[{id:`resume`,emoji:`📄`,name:`Analyze Resume`,status:!!t.profile,page:`resume`},{id:`skills`,emoji:`⚡`,name:`Review Skill Gaps`,status:!!t.profile,page:`skills`},{id:`careers`,emoji:`🎯`,name:`Choose Career Path`,status:t.selectedCareers.length>0,page:`careers`},{id:`roadmap`,emoji:`🗺️`,name:`Generate Roadmap`,status:!!t.roadmap,page:`roadmap`},{id:`interview`,emoji:`🤖`,name:`Practice Mock Interview`,status:!1,page:`interview`}],i=document.getElementById(`step-list`);i&&r.forEach(t=>{let r=n(`div`,{className:`progress-step ${t.status?`done`:`active`}`});r.innerHTML=`
      <span class="step-icon">${t.status?`✅`:t.emoji}</span>
      <div class="step-info">
        <div class="step-name">${t.name}</div>
        <div class="step-status">${t.status?`Completed`:`Pending`}</div>
      </div>
      <span class="step-arrow">›</span>
    `,r.addEventListener(`click`,()=>e(t.page)),i.appendChild(r)})}function l(e){let n=i(e),r=document.getElementById(`radar-chart-wrap`);if(!r)return;let a=n.pillars,o=[`Skills`,`Resume`,`Learning`,`Interview`,`Career`],s=[a.skills.score,a.resume.score,a.courses.score,a.interview.score,a.career.score];t(r,o,s,`#0f62fe`)}function u(t){r(async()=>{let{recommendCareers:e}=await import(`./recommender-C8-l-Jal.js`).then(e=>e.i);return{recommendCareers:e}},__vite__mapDeps([0,1,2])).then(({recommendCareers:r})=>{let i=document.getElementById(`top-careers-grid`);i&&(i.innerHTML=``,r(t.profile?.skills||[]).slice(0,3).forEach(t=>{let r=n(`div`,{className:`career-card`,style:`--career-color:${t.color}`});r.innerHTML=`
        <div class="career-icon">${t.emoji}</div>
        <div class="career-title">${t.title}</div>
        <div class="career-desc">${t.description.substring(0,90)}…</div>
        <div class="career-meta">
          <span class="career-match ${t.matchScore>=60?`match-high`:t.matchScore>=35?`match-medium`:`match-low`}">${t.matchScore}% match</span>
          <span class="career-salary">${t.salaryRange}</span>
        </div>
      `,r.addEventListener(`click`,()=>e(`careers`)),i.appendChild(r)}))})}function d(t){let r=[{emoji:`📄`,label:`Resume Analyzer`,page:`resume`,desc:`Parse & analyze`,color:`#0f62fe`},{emoji:`🤖`,label:`Mock Interview`,page:`interview`,desc:`AI-powered Q&A`,color:`#6929c4`},{emoji:`🎓`,label:`Courses`,page:`courses`,desc:`IBM SkillsBuild`,color:`#007d79`},{emoji:`📊`,label:`Readiness Score`,page:`score`,desc:`Track progress`,color:`#198038`}],i=document.getElementById(`quick-actions`);i&&r.forEach(t=>{let r=n(`div`,{className:`card card-sm`,style:`cursor:pointer;text-align:center;transition:box-shadow 0.15s,transform 0.15s`});r.innerHTML=`
      <div style="font-size:2rem;margin-bottom:0.5rem">${t.emoji}</div>
      <div style="font-weight:600;font-size:0.9375rem;margin-bottom:2px">${t.label}</div>
      <div style="font-size:0.8rem;color:var(--text-secondary)">${t.desc}</div>
    `,r.style.borderTop=`3px solid ${t.color}`,r.addEventListener(`mouseenter`,()=>{r.style.transform=`translateY(-3px)`,r.style.boxShadow=`var(--shadow-md)`}),r.addEventListener(`mouseleave`,()=>{r.style.transform=``,r.style.boxShadow=``}),r.addEventListener(`click`,()=>e(t.page)),i.appendChild(r)})}export{o as onMount,a as render};