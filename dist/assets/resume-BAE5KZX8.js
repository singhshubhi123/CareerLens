const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/pdf-DMVJ3WGV.js","assets/index-PtNS_aXy.js","assets/rolldown-runtime-DK3Fl9T5.js","assets/index-DycPD6sQ.css"])))=>i.map(i=>d[i]);
import{a as e,i as t,o as n,r,s as i}from"./index-PtNS_aXy.js";import{t as a}from"./data-B5kr3qfV.js";var o=Object.values(a.skillCategories).flatMap(e=>e.skills),s={js:`JavaScript`,ts:`TypeScript`,py:`Python`,node:`Node.js`,nodejs:`Node.js`,"react.js":`React`,reactjs:`React`,vue:`Vue.js`,vuejs:`Vue.js`,"angular.js":`Angular`,angularjs:`Angular`,ml:`Machine Learning`,ai:`Machine Learning`,"deep learning":`Deep Learning`,dl:`Deep Learning`,tf:`TensorFlow`,tensorflow2:`TensorFlow`,pytorch:`PyTorch`,torch:`PyTorch`,k8s:`Kubernetes`,kube:`Kubernetes`,aws:`AWS`,"amazon web services":`AWS`,gcp:`Google Cloud`,"google cloud platform":`Google Cloud`,azure:`Azure`,"microsoft azure":`Azure`,linux:`Linux`,unix:`Linux`,"ci/cd":`CI/CD`,cicd:`CI/CD`,rest:`REST APIs`,"rest api":`REST APIs`,agile:`Agile/Scrum`,scrum:`Agile/Scrum`,nlp:`NLP`,"natural language processing":`NLP`,cv:`Computer Vision`,"computer vision":`Computer Vision`,ux:`UI/UX Design`,"ui/ux":`UI/UX Design`,figma:`Figma`,postgres:`PostgreSQL`,psql:`PostgreSQL`,mongo:`MongoDB`,mongodb:`MongoDB`,mysql:`MySQL`,pandas:`Pandas`,numpy:`NumPy`,sklearn:`Scikit-learn`,scikit:`Scikit-learn`};function c(e){if(!e||e.trim().length===0)return[];let t=e.toLowerCase(),n=new Set;for(let e of o)t.includes(e.toLowerCase())&&n.add(e);for(let[e,r]of Object.entries(s))t.includes(e.toLowerCase())&&n.add(r);return[...n]}function l(e){if(!e)return 0;for(let t of[/(\d+)\s*\+?\s*years?\s+(?:of\s+)?(?:work\s+)?experience/i,/experience[:\s]+(\d+)\s*\+?\s*years?/i,/(\d+)\s*-\s*\d+\s*years?\s+of\s+experience/i]){let n=e.match(t);if(n)return parseInt(n[1],10)}let t=(e.match(/\b(engineer|developer|analyst|scientist|designer|manager|intern)\b/gi)||[]).length;return Math.max(0,t-1)}function u(e){if(!e)return null;let t=e.toLowerCase();return t.includes(`phd`)||t.includes(`ph.d`)||t.includes(`doctorate`)?`PhD`:t.includes(`master`)||t.includes(`m.s.`)||t.includes(`mba`)||t.includes(`m.tech`)?`Master's`:t.includes(`bachelor`)||t.includes(`b.s.`)||t.includes(`b.e.`)||t.includes(`b.tech`)||t.includes(`undergraduate`)?`Bachelor's`:t.includes(`associate`)||t.includes(`diploma`)?`Associate / Diploma`:`High School / Other`}function d(e){if(!e)return{};let t=e.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i),n=e.match(/(\+?\d[\d\s\-().]{7,}\d)/),r=e.match(/linkedin\.com\/in\/[\w-]+/i),i=e.match(/github\.com\/[\w-]+/i);return{email:t?t[0]:null,phone:n?n[0].trim():null,linkedin:r?r[0]:null,github:i?i[0]:null}}function f(e){if(!e)return`Student`;let t=e.trim().split(`
`)[0].trim();return t.length<50&&/^[A-Za-z\s.'-]+$/.test(t)?t:`Student`}function p(e){let t=c(e),n=l(e),r=u(e),i=d(e),o=f(e),s={};for(let[e,n]of Object.entries(a.skillCategories)){let r=n.skills.filter(e=>t.includes(e));r.length>0&&(s[e]={label:n.label,skills:r})}return{name:o,contact:i,skills:t,skillsByCategory:s,experience:n,education:r,resumeScore:m(e,t,n,r,i),wordCount:e.trim().split(/\s+/).length,analyzedAt:new Date().toISOString()}}function m(e,t,n,r,i){let a=0;i.email&&(a+=10),i.phone&&(a+=5),i.linkedin&&(a+=8),i.github&&(a+=7),r&&(a+=10),a+=Math.min(t.length*2,30),a+=Math.min(n*3,20);let o=e.trim().split(/\s+/).length;return o>200&&(a+=5),o>400&&(a+=5),Math.min(a,100)}var h=`John Smith
john.smith@email.com | +1-555-0123 | linkedin.com/in/johnsmith | github.com/johnsmith

EDUCATION
Bachelor's in Computer Science, Stanford University (2021)

EXPERIENCE
Software Engineering Intern — Google (2020)
- Developed Python scripts to automate data pipelines, improving efficiency by 40%
- Built REST APIs using Flask and deployed on Google Cloud
- Collaborated in Agile/Scrum environment with a team of 8 engineers

Data Science Intern — IBM (2021)
- Analyzed datasets with Pandas and NumPy to extract business insights
- Built machine learning models using Scikit-learn (classification accuracy: 94%)
- Created interactive dashboards using Tableau and SQL queries

SKILLS
Python, JavaScript, React, SQL, Machine Learning, TensorFlow, Docker, Git, 
Communication, Problem Solving, Teamwork, AWS, Node.js, HTML/CSS

PROJECTS
- Resume Analyzer: NLP-based app to extract skills from resumes using Python
- E-Commerce Platform: Full-stack app with React, Node.js, MongoDB`;function g(e){let t=r(`div`,{className:`animate-in`});return t.innerHTML=`
    <div class="page-header">
      <h1>📄 Resume Analyzer</h1>
      <p>Paste your resume text or upload a file. Our AI engine extracts your skills, education, and experience instantly.</p>
    </div>

    <div class="grid grid-2 gap-5" id="resume-layout">
      <!-- Input Panel -->
      <div>
        <!-- Upload Zone -->
        <div class="upload-zone mb-4" id="upload-zone">
          <div class="upload-icon">📁</div>
          <div class="upload-title">Drag & drop your resume</div>
          <div class="upload-sub">Supports PDF, DOCX, or plain text files · Max 5 MB</div>
          <div class="file-types">
            <span class="tag tag-blue">PDF</span>
            <span class="tag tag-blue">DOCX</span>
            <span class="tag tag-blue">TXT</span>
          </div>
          <input type="file" id="file-input" accept=".txt,.pdf,.doc,.docx" style="display:none"/>
          <button class="btn btn-secondary mt-4" id="upload-btn">Choose File</button>
        </div>

        <!-- File upload status banner (shown after a file is loaded) -->
        <div id="upload-status" style="display:none"></div>

        <!-- Divider -->
        <div style="text-align:center;margin:1rem 0;color:var(--text-secondary);font-size:0.875rem;position:relative">
          <span style="background:var(--ui-bg);padding:0 1rem;position:relative;z-index:1">or paste resume text below</span>
          <hr style="position:absolute;top:50%;left:0;right:0;border:none;border-top:1px solid var(--ui-03);z-index:0">
        </div>

        <!-- Text Input -->
        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
            <label class="form-label" for="resume-text">Resume Text</label>
            <button class="btn btn-ghost btn-sm" id="demo-btn">Load Demo Resume</button>
          </div>
          <textarea class="resume-textarea" id="resume-text" 
            placeholder="Paste your full resume here — include your skills, work experience, education, and projects..."
          >${e.profile?A():``}</textarea>
          <span class="form-helper" id="char-count">0 words</span>
        </div>

        <!-- Analyze Button -->
        <button class="btn btn-primary btn-lg w-full" id="analyze-btn">
          🔍 Analyze Resume
        </button>

        <!-- Skills Checklist -->
        <div class="card mt-5" id="skills-input-section">
          <div class="card-header">
            <div class="card-title">➕ Add/Edit Skills Manually</div>
          </div>
          <div id="manual-skill-input-wrap">
            <div style="display:flex;gap:0.5rem">
              <input type="text" class="form-input" id="manual-skill" placeholder="Type a skill (e.g. Python)" style="flex:1"/>
              <button class="btn btn-primary" id="add-skill-btn">Add</button>
            </div>
            <div class="skill-tag-list mt-3" id="manual-skills-list">
              ${E(e)}
            </div>
          </div>
        </div>
      </div>

      <!-- Results Panel -->
      <div id="results-panel">
        ${e.profile?D(e.profile):O()}
      </div>
    </div>
  `,t}function _(e){let t=document.getElementById(`resume-text`),r=document.getElementById(`char-count`),i=document.getElementById(`analyze-btn`),a=document.getElementById(`demo-btn`),o=document.getElementById(`upload-zone`),s=document.getElementById(`upload-btn`),c=document.getElementById(`file-input`),l=document.getElementById(`add-skill-btn`),u=document.getElementById(`manual-skill`);t?.addEventListener(`input`,()=>{let e=t.value.trim().split(/\s+/).filter(Boolean).length;r.textContent=`${e} word${e===1?``:`s`}`}),a?.addEventListener(`click`,()=>{t.value=h;let e=h.trim().split(/\s+/).length;r.textContent=`${e} words`,n(`Demo resume loaded!`,`info`)}),o?.addEventListener(`dragover`,e=>{e.preventDefault(),o.classList.add(`drag-over`)}),o?.addEventListener(`dragleave`,()=>o.classList.remove(`drag-over`)),o?.addEventListener(`drop`,e=>{e.preventDefault(),o.classList.remove(`drag-over`);let n=e.dataTransfer.files[0];n&&x(n,t,r)}),s?.addEventListener(`click`,()=>c.click()),c?.addEventListener(`change`,()=>{c.files[0]&&x(c.files[0],t,r)}),i?.addEventListener(`click`,()=>{let r=t?.value||``;if(r.trim().length<30){n(`Please enter more resume text (at least 30 characters)`,`warning`);return}C(r,e)}),l?.addEventListener(`click`,()=>w(e)),u?.addEventListener(`keydown`,t=>{t.key===`Enter`&&w(e)})}var v=5242880;function y(e,t=!1){let n=document.getElementById(`upload-status`);n&&(n.style.display=`block`,n.innerHTML=`
    <div class="upload-status-banner ${t?`upload-status-error`:`upload-status-success`}">
      <span>${t?`⚠️`:`✅`}</span>
      <span>${e}</span>
    </div>
  `)}function b(){let e=document.getElementById(`upload-status`);e&&(e.style.display=`none`)}function x(e,t,r){if(e.size>v){y(`"${e.name}" is too large (${(e.size/1024/1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`,!0),n(`File too large — max 5 MB allowed.`,`error`);return}let i=e.type===`application/pdf`||e.name.toLowerCase().endsWith(`.pdf`);if(e.type===`text/plain`||e.name.toLowerCase().endsWith(`.txt`)){b();let i=new FileReader;i.onload=i=>{t.value=i.target.result;let a=i.target.result.trim().split(/\s+/).filter(Boolean).length;r.textContent=`${a} word${a===1?``:`s`}`,y(`"${e.name}" loaded successfully (${a} words).`),n(`${e.name} loaded!`,`success`)},i.onerror=()=>{y(`Could not read "${e.name}". Please try again.`,!0),n(`Failed to read the file.`,`error`)},i.readAsText(e)}else i?(b(),S(e).then(i=>{if(!i||i.trim().length<20){y(`"${e.name}" could not be read — the PDF may be image-based or password-protected. Please paste the text manually.`,!0),n(`Could not extract text from PDF. Try pasting text manually.`,`warning`,5e3);return}t.value=i;let a=i.trim().split(/\s+/).filter(Boolean).length;r.textContent=`${a} word${a===1?``:`s`}`,y(`"${e.name}" uploaded and text extracted successfully (${a} words).`),n(`${e.name} loaded — ${a} words extracted!`,`success`)}).catch(t=>{y(`Failed to parse "${e.name}": ${t.message}. Please paste the text manually.`,!0),n(`PDF parsing failed. Please paste the text manually.`,`error`,5e3)})):e.name.toLowerCase().endsWith(`.doc`)||e.name.toLowerCase().endsWith(`.docx`)?(y(`DOCX files cannot be read directly. Please open "${e.name}" in Word, copy all the text, and paste it into the text area below.`,!1),n(`For DOCX files, please paste the text content directly. Copy text from your Word document and paste it.`,`info`,5e3)):(y(`Unsupported file type. Please upload a PDF (.pdf), Word (.docx), or plain text (.txt) file.`,!0),n(`Unsupported file type — PDF, DOCX, and TXT are accepted.`,`error`))}async function S(e){let t=await i(()=>import(`./pdf-DMVJ3WGV.js`),__vite__mapDeps([0,1,2,3]));t.GlobalWorkerOptions.workerSrc=new URL(`/assets/pdf.worker-CLesOks4.mjs`,``+import.meta.url).toString();let n=await e.arrayBuffer(),r=await t.getDocument({data:new Uint8Array(n)}).promise,a=[];for(let e=1;e<=r.numPages;e++){let t=await(await r.getPage(e)).getTextContent(),n=[],i=null;for(let e of t.items)`str`in e&&(i!==null&&Math.abs(e.transform[5]-i)>5&&n.push(`
`),n.push(e.str),i=e.transform[5]);a.push(n.join(` `))}return a.join(`
`)}function C(r,i){let a=document.getElementById(`analyze-btn`);a&&(a.innerHTML=`<span class="spinner" style="width:18px;height:18px;border-width:3px"></span> Analyzing…`,a.disabled=!0,sessionStorage.setItem(`resumeText`,r),setTimeout(()=>{try{let o=p(r);if(i.profile?.skills){let e=new Set(o.skills.map(e=>e.toLowerCase())),t=i.profile.skills.filter(t=>!e.has(t.toLowerCase()));o.skills=[...o.skills,...t]}i.profile=o,e();let s=document.getElementById(`results-panel`);s&&(s.innerHTML=D(o)),T(i),a.innerHTML=`✅ Analysis Complete!`,a.style.background=`var(--ibm-green)`,n(`Found ${o.skills.length} skills! Redirecting to dashboard…`,`success`),setTimeout(()=>{a.innerHTML=`🔍 Analyze Resume`,a.style.background=``,a.disabled=!1,t(`skills`)},1800)}catch(e){a.innerHTML=`🔍 Analyze Resume`,a.disabled=!1,n(`Analysis failed: `+e.message,`error`)}},800))}function w(t){let r=document.getElementById(`manual-skill`);if(!r)return;let i=r.value.trim();i&&(t.profile||={name:`Student`,skills:[],skillsByCategory:{},experience:0,education:null,resumeScore:0,wordCount:0,contact:{},analyzedAt:new Date().toISOString()},t.profile.skills.map(e=>e.toLowerCase()).includes(i.toLowerCase())?n(`"${i}" is already in your profile`,`warning`):(t.profile.skills.push(i),e(),T(t),n(`"${i}" added to your skills!`,`success`)),r.value=``)}function T(t){let n=document.getElementById(`manual-skills-list`);n&&(n.innerHTML=E(t)),document.querySelectorAll(`.skill-remove-btn`).forEach(n=>{n.addEventListener(`click`,()=>{let r=n.dataset.skill;t.profile&&(t.profile.skills=t.profile.skills.filter(e=>e!==r),e(),T(t))})})}function E(e){let t=e.profile?.skills||[];return t.length===0?`<p style="color:var(--text-secondary);font-size:0.8125rem">No skills added yet</p>`:t.map(e=>`
    <span class="skill-chip strong">
      ${e}
      <button class="skill-remove-btn" data-skill="${e}" style="background:none;border:none;cursor:pointer;color:inherit;font-size:0.9rem;padding:0;margin-left:2px">×</button>
    </span>
  `).join(``)}function D(e){let t=e.resumeScore>=70?`var(--ibm-green)`:e.resumeScore>=45?`var(--ibm-orange)`:`var(--ibm-red)`,n=e.resumeScore>=70?`Strong`:e.resumeScore>=45?`Good`:`Needs Work`;return`
    <!-- Profile Card -->
    <div class="card mb-4">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--ibm-blue);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;flex-shrink:0">
          ${e.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-size:1.125rem;font-weight:600">${e.name}</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">${e.education||`Education not detected`} · ${e.experience} yr${e.experience===1?``:`s`} exp</div>
        </div>
        <div style="margin-left:auto;text-align:center">
          <div style="font-size:1.75rem;font-weight:700;color:${t}">${e.resumeScore}</div>
          <div style="font-size:0.7rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em">Resume Score</div>
          <div style="font-size:0.75rem;font-weight:600;color:${t}">${n}</div>
        </div>
      </div>

      ${e.contact.email||e.contact.linkedin?`
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;font-size:0.8rem;color:var(--text-secondary)">
          ${e.contact.email?`<span>✉️ ${e.contact.email}</span>`:``}
          ${e.contact.phone?`<span>📞 ${e.contact.phone}</span>`:``}
          ${e.contact.linkedin?`<span>💼 ${e.contact.linkedin}</span>`:``}
          ${e.contact.github?`<span>🐙 ${e.contact.github}</span>`:``}
        </div>
      `:``}
    </div>

    <!-- Skills by Category -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title">⚡ Detected Skills (${e.skills.length})</div>
        <span class="tag tag-green">${e.skills.length} found</span>
      </div>
      ${Object.keys(e.skillsByCategory).length>0?Object.entries(e.skillsByCategory).map(([e,t])=>`
          <div class="extracted-section">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">${t.label}</div>
            <div class="skill-tag-list">
              ${t.skills.map(e=>`<span class="skill-chip strong">${e}</span>`).join(``)}
            </div>
          </div>
        `).join(``):`<p style="color:var(--text-secondary)">No skills detected. Try the demo resume or add skills manually.</p>`}
    </div>

    <!-- Resume Tips -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">💡 Resume Improvement Tips</div>
      </div>
      ${k(e).map(e=>`
        <div style="display:flex;gap:0.75rem;padding:0.625rem 0;border-bottom:1px solid var(--ui-03);">
          <span>${e.icon}</span>
          <div>
            <div style="font-size:0.875rem;font-weight:500">${e.title}</div>
            <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:2px">${e.desc}</div>
          </div>
        </div>
      `).join(``)}
    </div>

    <button class="btn btn-primary w-full mt-4" onclick="window._navigateTo('skills')">
      View Skill Gaps Analysis →
    </button>
  `}function O(){return`
    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Analysis Results Will Appear Here</h3>
      <p>Paste your resume text and click "Analyze Resume" to see your profile, skills, and improvement suggestions.</p>
    </div>
  `}function k(e){let t=[];return e.contact.email||t.push({icon:`✉️`,title:`Add email address`,desc:`Include a professional email so recruiters can contact you.`}),e.contact.linkedin||t.push({icon:`💼`,title:`Add LinkedIn URL`,desc:`A LinkedIn profile URL increases your credibility significantly.`}),e.contact.github||t.push({icon:`🐙`,title:`Add GitHub profile`,desc:`Show your portfolio — GitHub profiles are highly valued in tech.`}),e.skills.length<10&&t.push({icon:`⚡`,title:`Add more technical skills`,desc:`Aim for 12–20 relevant skills to improve ATS matching.`}),e.wordCount<300&&t.push({icon:`📝`,title:`Expand resume content`,desc:`Your resume seems short. Add more details about projects and achievements.`}),e.experience===0&&t.push({icon:`💼`,title:`Add work/internship experience`,desc:`Include internships, freelance work, or academic projects.`}),t.length===0&&t.push({icon:`✅`,title:`Good resume structure!`,desc:`Your resume has all key sections. Focus on quantifying your achievements.`}),t.push({icon:`🎯`,title:`Tailor for each job`,desc:`Customize your resume's keywords to match each job description for better ATS scores.`}),t.slice(0,5)}function A(){return sessionStorage.getItem(`resumeText`)||``}export{_ as onMount,g as render};