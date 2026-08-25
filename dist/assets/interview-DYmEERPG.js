const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/interview-BsBhX070.js","assets/rolldown-runtime-DK3Fl9T5.js","assets/data-B5kr3qfV.js"])))=>i.map(i=>d[i]);
import{a as e,i as t,o as n,r,s as i}from"./index-PtNS_aXy.js";import{t as a}from"./data-B5kr3qfV.js";import{a as o,n as s,o as c,t as l}from"./interview-BsBhX070.js";function u(e){let t=r(`div`,{className:`animate-in`});return t.innerHTML=e.interviewSession?m(e.interviewSession,e):f(e),t}function d(e){e.interviewSession?h(e):p(e)}function f(e){return`
    <div class="page-header">
      <h1>🤖 AI Mock Interview</h1>
      <p>Practice real interview questions with instant AI feedback on your answers. Improve your score with every session.</p>
    </div>

    <div style="max-width:600px">
      <!-- Setup Card -->
      <div class="card card-lg mb-5">
        <div class="card-header">
          <div class="card-title">🎯 Configure Your Interview</div>
        </div>

        <div class="form-group">
          <label class="form-label" for="career-select">Target Career Role</label>
          <select class="form-select" id="career-select">
            ${a.careerPaths.map(t=>`
    <option value="${t.id}" ${e.selectedCareers.includes(t.id)?`selected`:``}>
      ${t.emoji} ${t.title}
    </option>
  `).join(``)}
          </select>
          <span class="form-helper">Questions will be tailored to this role</span>
        </div>

        <div class="form-group">
          <label class="form-label">Number of Questions</label>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap" id="q-count-btns">
            ${[3,5,10].map(e=>`
              <button class="btn ${e===5?`btn-primary`:`btn-secondary`} q-count-btn" data-count="${e}">
                ${e} Questions ${e===5?`(Recommended)`:e===3?`(Quick)`:`(Full)`}
              </button>
            `).join(``)}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Interview Type</label>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            <label class="form-check">
              <input type="radio" name="interview-type" value="mixed" checked> Mixed (Technical + Behavioral)
            </label>
            <label class="form-check">
              <input type="radio" name="interview-type" value="technical"> Technical Only
            </label>
            <label class="form-check">
              <input type="radio" name="interview-type" value="behavioral"> Behavioral Only
            </label>
          </div>
        </div>

        <button class="btn btn-primary btn-lg w-full" id="start-interview-btn">
          🎤 Start Interview Session
        </button>
      </div>

      <!-- Tips Card -->
      <div class="card mb-5">
        <div class="card-header">
          <div class="card-title">💡 Interview Tips</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;font-size:0.875rem">
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>📝</span>
            <div><strong>Use the STAR method</strong> for behavioral questions: Situation, Task, Action, Result</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>⏱️</span>
            <div><strong>Aim for 2-3 minute answers</strong> — detailed enough to show expertise, concise enough to stay on point</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>🎯</span>
            <div><strong>Be specific</strong> — use concrete examples, metrics, and outcomes from your experience</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:flex-start">
            <span>🔄</span>
            <div><strong>Practice multiple times</strong> — each session improves your score and fluency</div>
          </div>
        </div>
      </div>

      <!-- Past Sessions -->
      <div id="past-sessions-wrap"></div>
    </div>
  `}function p(e){let n=5;document.querySelectorAll(`.q-count-btn`).forEach(e=>{e.addEventListener(`click`,()=>{document.querySelectorAll(`.q-count-btn`).forEach(e=>e.className=`btn btn-secondary q-count-btn`),e.className=`btn btn-primary q-count-btn`,n=parseInt(e.dataset.count)})}),document.getElementById(`start-interview-btn`)?.addEventListener(`click`,()=>{let r=document.getElementById(`career-select`)?.value||`data-scientist`;e.interviewSession=c(r,n),t(`interview`)}),i(async()=>{let{getInterviewHistory:e}=await import(`./interview-BsBhX070.js`).then(e=>e.i);return{getInterviewHistory:e}},__vite__mapDeps([0,1,2])).then(({getInterviewHistory:e})=>{let t=e(),n=document.getElementById(`past-sessions-wrap`);!n||t.length===0||(n.innerHTML=`
      <div class="card">
        <div class="card-header">
          <div class="card-title">📜 Past Sessions</div>
        </div>
        ${t.map(e=>{let t=a.careerPaths.find(t=>t.id===e.careerId);return`
            <div style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid var(--ui-03);font-size:0.875rem">
              <div>
                <div style="font-weight:500">${t?.emoji||`🤖`} ${t?.title||e.careerId}</div>
                <div style="color:var(--text-secondary);font-size:0.75rem">${new Date(e.date).toLocaleDateString()} · ${e.questionCount} questions</div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.25rem;font-weight:700;color:${e.score?.avg>=70?`var(--ibm-green)`:e.score?.avg>=50?`var(--ibm-orange)`:`var(--ibm-red)`}">
                  ${e.score?.avg||0}%
                </div>
              </div>
            </div>
          `}).join(``)}
      </div>
    `)})}function m(e,t){let n=e.questions[e.currentIndex],r=e.currentIndex+1,i=e.questions.length,o=e.answers[e.currentIndex]||``;return`
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
        <div>
          <h1>🤖 Mock Interview</h1>
          <p>Question ${r} of ${i} · ${a.careerPaths.find(t=>t.id===e.careerId)?.title||e.careerId}</p>
        </div>
        <div style="display:flex;gap:0.75rem;align-items:center">
          <div class="interview-timer" id="session-timer">00:00</div>
          <button class="btn btn-secondary btn-sm" id="end-session-btn">End Session</button>
        </div>
      </div>
    </div>

    <div class="interview-arena">
      <!-- Main Column -->
      <div class="interview-main">
        <!-- Question -->
        <div class="question-card">
          <div class="question-number">Question ${r} of ${i}</div>
          <div class="question-text">${n.q}</div>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
            <span class="question-difficulty">
              ${y(n.difficulty)} ${n.difficulty}
            </span>
            <span class="question-difficulty">🏷️ ${n.topic}</span>
          </div>
        </div>

        <!-- Hint -->
        <div style="background:rgba(255,255,255,0.6);border:1px solid var(--ui-03);border-radius:var(--border-radius);padding:0.75rem 1rem;font-size:0.8125rem;color:var(--text-secondary)">
          <strong style="color:var(--text-primary)">💡 Tip:</strong> ${n.tips}
        </div>

        <!-- Answer Area -->
        <div class="answer-area">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem">
            <div style="font-size:0.875rem;font-weight:600;color:var(--text-secondary)">Your Answer</div>
            <div id="word-count-answer" style="font-size:0.75rem;color:var(--text-secondary)">0 words</div>
          </div>
          <textarea class="answer-textarea" id="answer-input" 
            placeholder="Type your answer here. Be specific, use examples, and structure your response clearly…"
          >${o}</textarea>
          <hr class="section-divider">
          <div class="interview-actions">
            <div id="question-timer" class="interview-timer">02:00</div>
            <button class="btn btn-primary" id="submit-answer-btn" style="flex:1">
              Submit Answer & Get AI Feedback
            </button>
            <button class="btn btn-ghost btn-sm" id="skip-btn">Skip →</button>
          </div>
        </div>

        <!-- Feedback Area -->
        <div id="feedback-area" class="${e.feedbacks[e.currentIndex]?``:`hidden`}">
          ${e.feedbacks[e.currentIndex]?v(e.feedbacks[e.currentIndex]):``}
        </div>

        <!-- Nav buttons -->
        <div style="display:flex;gap:0.75rem;justify-content:space-between">
          <button class="btn btn-secondary ${e.currentIndex,``}" id="prev-btn"
            ${e.currentIndex===0?`disabled`:``}>← Previous</button>
          ${e.currentIndex<i-1?`<button class="btn btn-primary" id="next-btn">Next Question →</button>`:`<button class="btn btn-primary" id="finish-btn" style="background:var(--ibm-green)">🏁 Finish & See Results</button>`}
        </div>
      </div>

      <!-- Sidebar -->
      <div>
        <!-- Score Ring (if feedback available) -->
        <div class="feedback-panel mb-4">
          <div style="text-align:center;margin-bottom:0.75rem;font-size:0.875rem;font-weight:600">Session Score</div>
          <div class="feedback-score-ring" id="score-ring" style="--score:${l(e).avg}">
            <span class="feedback-score-value">${l(e).avg}%</span>
          </div>
          <div style="text-align:center;font-size:0.8125rem;color:var(--text-secondary);margin-top:0.5rem">
            ${l(e).answered} answered
          </div>
        </div>

        <!-- Question Navigator -->
        <div class="feedback-panel">
          <div style="font-size:0.875rem;font-weight:600;margin-bottom:0.75rem">Questions</div>
          <div class="interview-progress" id="question-nav">
            ${e.questions.map((t,n)=>`
              <div class="interview-q-dot ${n===e.currentIndex?`current`:e.answers[n]?`answered`:``}"
                data-idx="${n}">
                <div class="q-status-dot ${n===e.currentIndex?`current`:e.answers[n]?`answered`:``}"></div>
                <span style="font-size:0.8rem">Q${n+1}: ${t.topic}</span>
                ${e.feedbacks[n]?`<span style="margin-left:auto;font-size:0.75rem;font-weight:600;color:${e.feedbacks[n].overallScore>=70?`var(--ibm-green)`:`var(--ibm-orange)`}">
                  ${e.feedbacks[n].overallScore}%
                </span>`:``}
              </div>
            `).join(``)}
          </div>
        </div>
      </div>
    </div>
  `}function h(r){let i=r.interviewSession,a,c=120,u=Date.now(),d=document.getElementById(`session-timer`),f=setInterval(()=>{let e=Math.floor((Date.now()-u)/1e3),t=Math.floor(e/60).toString().padStart(2,`0`),n=(e%60).toString().padStart(2,`0`);d&&(d.textContent=`${t}:${n}`)},1e3),p=document.getElementById(`question-timer`);a=setInterval(()=>{c--;let e=Math.floor(c/60).toString().padStart(2,`0`),t=(c%60).toString().padStart(2,`0`);p&&(p.textContent=`${e}:${t}`,p.className=`interview-timer${c<=30?` warning`:``}`),c<=0&&clearInterval(a)},1e3);let m=document.getElementById(`answer-input`),h=document.getElementById(`word-count-answer`);m?.addEventListener(`input`,()=>{let e=m.value.trim().split(/\s+/).filter(Boolean).length;h&&(h.textContent=`${e} words`)}),m&&h&&(h.textContent=`${m.value.trim().split(/\s+/).filter(Boolean).length} words`),document.getElementById(`submit-answer-btn`)?.addEventListener(`click`,()=>{let t=m?.value||``,r=i.questions[i.currentIndex];i.answers[i.currentIndex]=t;let o=s(r,t,i.careerId);i.feedbacks[i.currentIndex]=o,clearInterval(a),e();let c=document.getElementById(`feedback-area`);c&&(c.innerHTML=v(o),c.classList.remove(`hidden`),c.scrollIntoView({behavior:`smooth`,block:`nearest`}));let u=l(i),d=document.getElementById(`score-ring`);if(d){d.style.setProperty(`--score`,u.avg);let e=d.querySelector(`.feedback-score-value`);e&&(e.textContent=u.avg+`%`)}let f=document.querySelector(`[data-idx="${i.currentIndex}"] .q-status-dot`);f&&f.classList.add(`answered`),n(`AI scored your answer: ${o.overallScore}%`,o.overallScore>=70?`success`:`info`)}),document.getElementById(`skip-btn`)?.addEventListener(`click`,()=>{g(i.currentIndex+1,i,r,a,f)}),document.getElementById(`prev-btn`)?.addEventListener(`click`,()=>{i.currentIndex>0&&g(i.currentIndex-1,i,r,a,f)}),document.getElementById(`next-btn`)?.addEventListener(`click`,()=>{_(i,m),g(i.currentIndex+1,i,r,a,f)}),document.getElementById(`finish-btn`)?.addEventListener(`click`,()=>{_(i,m),clearInterval(a),clearInterval(f),i.completed=!0,i.endedAt=Date.now(),o(i),r.interviewSession=null,e(),t(`score`),n(`Interview complete! Check your Job Readiness Score 🎉`,`success`)}),document.getElementById(`end-session-btn`)?.addEventListener(`click`,()=>{confirm(`End this interview session? Your progress will be saved.`)&&(clearInterval(a),clearInterval(f),_(i,m),o(i),r.interviewSession=null,e(),t(`interview`))}),document.querySelectorAll(`[data-idx]`).forEach(e=>{e.addEventListener(`click`,()=>{_(i,m),g(parseInt(e.dataset.idx),i,r,a,f)})})}function g(n,r,i,a,o){n<0||n>=r.questions.length||(r.currentIndex=n,e(),t(`interview`))}function _(e,t){t&&(e.answers[e.currentIndex]=t.value)}function v(e){let t=e.overallScore>=70?`var(--ibm-green)`:e.overallScore>=50?`var(--ibm-orange)`:`var(--ibm-red)`;return`
    <div class="card animate-in" style="border-color:${t};border-left-width:4px">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <div style="font-size:2rem;font-weight:700;color:${t}">${e.overallScore}%</div>
        <div>
          <div style="font-weight:600">AI Feedback</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">
            ${e.overallScore>=80?`🌟 Excellent`:e.overallScore>=65?`✅ Good`:e.overallScore>=45?`📈 Fair`:`⚠️ Needs Work`}
          </div>
        </div>
      </div>

      <!-- Criteria -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1rem">
        ${Object.entries(e.criteria).map(([e,t])=>`
          <div>
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:3px">
              <span style="text-transform:capitalize;color:var(--text-secondary)">${e}</span>
              <span style="font-weight:600">${t}%</span>
            </div>
            <div class="progress-bar-wrap" style="height:5px">
              <div class="progress-bar-fill" style="width:${t}%;background:${t>=70?`var(--ibm-green)`:t>=45?`var(--ibm-orange)`:`var(--ibm-red)`}"></div>
            </div>
          </div>
        `).join(``)}
      </div>

      <p style="font-size:0.875rem;line-height:1.55;margin-bottom:0.75rem">${e.feedback}</p>

      ${e.suggestions.length>0?`
        <div class="ai-suggestion">
          <strong>💡 Suggestions:</strong>
          <ul style="margin-top:0.375rem;padding-left:1.25rem;font-size:0.8125rem">
            ${e.suggestions.map(e=>`<li style="margin-bottom:3px">${e}</li>`).join(``)}
          </ul>
        </div>
      `:``}

      ${e.keywords.length>0?`
        <div style="margin-top:0.75rem">
          <div style="font-size:0.75rem;color:var(--text-secondary);margin-bottom:0.375rem">Detected keywords:</div>
          <div class="skill-tag-list">
            ${e.keywords.map(e=>`<span class="tag tag-teal" style="font-size:0.7rem">${e}</span>`).join(``)}
          </div>
        </div>
      `:``}
    </div>
  `}function y(e){return e===`Easy`?`🟢`:e===`Medium`?`🟡`:`🔴`}export{d as onMount,u as render};