import{a as e,i as t,o as n,r}from"./index-PtNS_aXy.js";import{t as i}from"./data-B5kr3qfV.js";import{r as a}from"./recommender-C8-l-Jal.js";function o(e){let t=r(`div`,{className:`animate-in`}),n=e.selectedCareers.length>0?e.selectedCareers:[],o=a(n,e.profile?.skills||[]),s=[`all`,`ai`,`cloud`,`data`,`security`,`development`,`design`,`methodology`],l={all:`All Courses`,ai:`🤖 AI & ML`,cloud:`☁️ Cloud`,data:`📊 Data`,security:`🔐 Security`,development:`💻 Development`,design:`🎨 Design`,methodology:`📋 Methodology`};return t.innerHTML=`
    <div class="page-header">
      <h1>🎓 IBM SkillsBuild Courses</h1>
      <p>AI-curated courses from IBM SkillsBuild, ranked by your skill gaps and career goals.</p>
    </div>

    <!-- SkillsBuild Branding Strip -->
    <div class="skillsbuild-strip">
      <span class="ibm-logo">IBM</span>
      <span style="opacity:0.5">|</span>
      <span>SkillsBuild — Free learning for your career</span>
      <span style="margin-left:auto;font-size:0.75rem;opacity:0.8">${o.length} courses available</span>
    </div>

    <!-- Stats -->
    <div class="grid grid-4 mb-5 stagger">
      <div class="stat-card" style="--accent-color:#0f62fe">
        <div class="stat-label">Available Courses</div>
        <div class="stat-value">${i.courses.length}</div>
        <div class="stat-desc">IBM SkillsBuild catalog</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-green)">
        <div class="stat-label">Free Courses</div>
        <div class="stat-value">${i.courses.filter(e=>e.free).length}</div>
        <div class="stat-desc">No cost to you</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-purple)">
        <div class="stat-label">Completed</div>
        <div class="stat-value">${e.completedCourses?.length||0}</div>
        <div class="stat-desc">courses finished</div>
      </div>
      <div class="stat-card" style="--accent-color:var(--ibm-teal)">
        <div class="stat-label">Badges Earned</div>
        <div class="stat-value">${e.completedCourses?.length||0}</div>
        <div class="stat-desc">digital credentials</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4 flex-wrap" style="align-items:center">
      <div class="filter-tabs" id="cat-filter" style="margin-bottom:0">
        ${s.map(e=>`
          <button class="filter-tab ${e===`all`?`active`:``}" data-cat="${e}">
            ${l[e]||e}
          </button>
        `).join(``)}
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
      ${c(o,e.completedCourses||[])}
    </div>
  `,t}function s(e){document.querySelectorAll(`[data-cat]`).forEach(t=>{t.addEventListener(`click`,()=>{document.querySelectorAll(`[data-cat]`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),u(e)})}),document.getElementById(`level-filter`)?.addEventListener(`change`,()=>u(e)),document.getElementById(`price-filter`)?.addEventListener(`change`,()=>u(e)),l(e)}function c(e,t){return e.length===0?`<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-secondary)">No courses match your filters.</div>`:e.map(e=>{let n=t.includes(e.id);return`
      <div class="course-card" data-course-id="${e.id}">
        <div class="course-card-header" style="background:${e.color};"></div>
        <div class="course-card-body">
          <div class="course-provider">${e.provider}</div>
          <div class="course-title">${e.title}</div>
          <div class="course-desc">${e.description}</div>

          <div class="course-meta">
            <span class="course-meta-item">⏱ ${e.duration}</span>
            <span class="course-meta-item">📶 ${e.level}</span>
            <span class="course-meta-item">⭐ ${e.rating}</span>
            <span class="course-meta-item">👥 ${e.enrolled}</span>
          </div>

          <!-- Skills covered -->
          <div class="skill-tag-list mb-3">
            ${e.skills.map(e=>`<span class="tag tag-blue" style="font-size:0.7rem">${e}</span>`).join(``)}
          </div>

          ${e.badge?`
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
              <span style="font-size:1rem">🏅</span>
              <span style="font-size:0.8125rem;font-weight:500;color:var(--ibm-purple)">Badge: ${e.badge}</span>
            </div>
          `:``}
        </div>

        <div class="course-footer">
          <span class="${e.free?`tag tag-green`:`tag tag-yellow`}" style="font-size:0.75rem">
            ${e.free?`✓ Free`:`💰 Premium`}
          </span>

          <div style="display:flex;gap:0.5rem">
            ${n?`<span class="tag tag-green">✅ Completed</span>
                 <button class="btn btn-ghost btn-sm uncomplete-btn" data-id="${e.id}">Undo</button>`:`<button class="btn btn-secondary btn-sm complete-btn" data-id="${e.id}">Mark Complete</button>
                 <a href="${e.url}" target="_blank" class="btn btn-primary btn-sm">Enroll →</a>`}
          </div>
        </div>
      </div>
    `}).join(``)}function l(r){document.querySelectorAll(`.complete-btn`).forEach(i=>{i.addEventListener(`click`,()=>{let a=i.dataset.id;r.completedCourses.includes(a)||(r.completedCourses.push(a),e(),n(`Course marked as complete! 🎓 Badge earned!`,`success`),t(`courses`))})}),document.querySelectorAll(`.uncomplete-btn`).forEach(i=>{i.addEventListener(`click`,()=>{let a=i.dataset.id;r.completedCourses=r.completedCourses.filter(e=>e!==a),e(),n(`Course unmarked`,`info`),t(`courses`)})})}function u(e){let t=document.querySelector(`[data-cat].active`)?.dataset.cat||`all`,n=document.getElementById(`level-filter`)?.value||``,r=document.getElementById(`price-filter`)?.value||``,i=e.selectedCareers.length>0?e.selectedCareers:[],o=a(i,e.profile?.skills||[]);t!==`all`&&(o=o.filter(e=>e.category===t)),n&&(o=o.filter(e=>e.level===n)),r===`free`&&(o=o.filter(e=>e.free));let s=document.getElementById(`courses-grid`);s&&(s.innerHTML=c(o,e.completedCourses||[]),l(e))}export{s as onMount,o as render};