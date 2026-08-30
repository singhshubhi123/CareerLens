/* =========================================================
   CareerLens — Resume Builder Page
   ATS-friendly resume generator with live preview,
   multi-step wizard, and PDF/DOCX download.
   ========================================================= */
import { saveState, showToast, el } from '../js/app.js';
import { evaluateAchievements, updateStreak } from '../js/achievements.js';

/* ── Step definitions ───────────────────────────────────── */
const STEPS = [
  { id: 'contact',    label: 'Contact',    icon: '👤' },
  { id: 'summary',    label: 'Summary',    icon: '📝' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education',  label: 'Education',  icon: '🎓' },
  { id: 'skills',     label: 'Skills',     icon: '⚡' },
  { id: 'projects',   label: 'Projects',   icon: '🚀' },
];

/* ── Default / blank data structure ────────────────────── */
function blankData() {
  return {
    contact: { name: '', email: '', phone: '', location: '', linkedin: '', github: '' },
    summary: '',
    experience: [blankExp()],
    education: [blankEdu()],
    skills: [],
    projects: [blankProject()],
  };
}
function blankExp() {
  return { title: '', company: '', startDate: '', endDate: '', current: false, bullets: ['', ''] };
}
function blankEdu() {
  return { degree: '', field: '', institution: '', year: '', gpa: '' };
}
function blankProject() {
  return { name: '', url: '', tech: '', description: '' };
}

/* ── Merge profile skills into builder data ─────────────── */
function seedFromProfile(data, profile) {
  if (!profile) return;
  if (!data.contact.name && profile.name && profile.name !== 'Student') {
    data.contact.name = profile.name;
  }
  if (!data.contact.email && profile.contact?.email)   data.contact.email   = profile.contact.email;
  if (!data.contact.phone && profile.contact?.phone)   data.contact.phone   = profile.contact.phone;
  if (!data.contact.linkedin && profile.contact?.linkedin) data.contact.linkedin = profile.contact.linkedin;
  if (!data.contact.github && profile.contact?.github)  data.contact.github  = profile.contact.github;
  if (data.skills.length === 0 && profile.skills?.length > 0) {
    data.skills = [...profile.skills].slice(0, 24);
  }
}

/* =========================================================
   RENDER
   ========================================================= */
export function render(appState) {
  // Ensure state field exists
  if (!appState.resumeBuilder) appState.resumeBuilder = blankData();
  const data = appState.resumeBuilder;

  // Seed from resume analyzer on first use
  if (appState.profile && !appState._rbSeeded) {
    seedFromProfile(data, appState.profile);
    appState._rbSeeded = true;
  }

  const container = el('div', { className: 'animate-in' });
  container.innerHTML = `
    <div class="page-header">
      <h1>✏️ Resume Builder</h1>
      <p>Build an ATS-optimised resume step by step. Your draft auto-saves and is available to download as PDF or DOCX.</p>
    </div>

    <div class="rb-layout" id="rb-layout">

      <!-- ── LEFT PANEL: Wizard ─────────────────────────── -->
      <div class="rb-form-panel" id="rb-form-panel">

        <!-- Step progress bar -->
        <div class="rb-wizard-progress" id="rb-wizard-progress">
          ${renderWizardProgress(0)}
        </div>

        <!-- Step form area -->
        <div class="card rb-step-card" id="rb-step-card">
          ${renderStepForm(0, data)}
        </div>

        <!-- Navigation buttons -->
        <div class="rb-nav-row" id="rb-nav-row">
          <button class="btn btn-secondary" id="rb-back-btn" style="display:none">← Back</button>
          <div style="flex:1"></div>
          <button class="btn btn-ghost btn-sm" id="rb-save-btn">💾 Save Draft</button>
          <button class="btn btn-primary" id="rb-next-btn">Next →</button>
        </div>

      </div>

      <!-- ── RIGHT PANEL: Live Preview ──────────────────── -->
      <div class="rb-preview-panel" id="rb-preview-panel">

        <!-- ATS Score -->
        <div class="card rb-ats-card mb-4" id="rb-ats-card">
          <div class="card-header">
            <div class="card-title">🎯 ATS Compatibility Score</div>
          </div>
          <div id="rb-ats-body">
            ${renderATSScore(data)}
          </div>
        </div>

        <!-- Download buttons -->
        <div style="display:flex;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap">
          <button class="btn btn-primary" id="rb-pdf-btn" style="flex:1;min-width:120px">
            📄 Download PDF
          </button>
          <button class="btn btn-secondary" id="rb-docx-btn" style="flex:1;min-width:120px">
            📝 Download DOCX
          </button>
        </div>

        <!-- A4 resume preview -->
        <div class="rb-preview" id="rb-preview">
          ${renderResumeHTML(data)}
        </div>

      </div>
    </div>
  `;

  return container;
}

/* =========================================================
   MOUNT — event wiring
   ========================================================= */
export function onMount(appState) {
  const data = appState.resumeBuilder;
  let currentStep = 0;

  function goTo(step) {
    currentStep = step;
    const card = document.getElementById('rb-step-card');
    const progress = document.getElementById('rb-wizard-progress');
    const backBtn = document.getElementById('rb-back-btn');
    const nextBtn = document.getElementById('rb-next-btn');
    if (card)     card.innerHTML = renderStepForm(step, data);
    if (progress) progress.innerHTML = renderWizardProgress(step);
    if (backBtn)  backBtn.style.display = step === 0 ? 'none' : '';
    if (nextBtn)  nextBtn.textContent   = step === STEPS.length - 1 ? '✅ Finish' : 'Next →';
    bindStepInputs(step, data, refreshPreview);
  }

  function refreshPreview() {
    const preview  = document.getElementById('rb-preview');
    const atsBody  = document.getElementById('rb-ats-body');
    if (preview) preview.innerHTML  = renderResumeHTML(data);
    if (atsBody) atsBody.innerHTML  = renderATSScore(data);
  }

  // Back
  document.getElementById('rb-back-btn')?.addEventListener('click', () => {
    if (currentStep > 0) goTo(currentStep - 1);
  });

  // Next / Finish
  document.getElementById('rb-next-btn')?.addEventListener('click', () => {
    collectStepData(currentStep, data);
    saveState();
    refreshPreview();
    if (currentStep < STEPS.length - 1) {
      goTo(currentStep + 1);
    } else {
      _fireAchievements(appState);
      showToast('Resume saved! Use the download buttons to export.', 'success', 4000);
    }
  });

  // Save draft
  document.getElementById('rb-save-btn')?.addEventListener('click', () => {
    collectStepData(currentStep, data);
    saveState();
    refreshPreview();
    showToast('Draft saved!', 'success');
  });

  // PDF
  document.getElementById('rb-pdf-btn')?.addEventListener('click', () => downloadPDF());

  // DOCX
  document.getElementById('rb-docx-btn')?.addEventListener('click', () => downloadDOCX(data));

  // Bind inputs for step 0 on initial mount
  bindStepInputs(0, data, refreshPreview);

  // Initial preview
  refreshPreview();
}

/* =========================================================
   WIZARD PROGRESS BAR
   ========================================================= */
function renderWizardProgress(activeIdx) {
  return STEPS.map((s, i) => {
    const done   = i < activeIdx;
    const active = i === activeIdx;
    const dotClass = done ? 'rb-dot done' : active ? 'rb-dot active' : 'rb-dot';
    const line = i < STEPS.length - 1
      ? `<div class="rb-wiz-line${done ? ' done' : ''}"></div>`
      : '';
    return `
      <div class="rb-wiz-step">
        <div class="${dotClass}">${done ? '✓' : i + 1}</div>
        <div class="rb-wiz-label${active ? ' active' : ''}">${s.icon} ${s.label}</div>
      </div>
      ${line}
    `;
  }).join('');
}

/* =========================================================
   STEP FORMS
   ========================================================= */
function renderStepForm(step, data) {
  switch (step) {
    case 0: return renderContactStep(data.contact);
    case 1: return renderSummaryStep(data.summary);
    case 2: return renderExperienceStep(data.experience);
    case 3: return renderEducationStep(data.education);
    case 4: return renderSkillsStep(data.skills);
    case 5: return renderProjectsStep(data.projects);
    default: return '';
  }
}

function renderContactStep(c) {
  return `
    <h3 class="rb-step-title">👤 Contact Information</h3>
    <p class="rb-step-sub">This appears at the top of your resume. ATS parsers read this first.</p>
    <div class="grid grid-2 gap-3">
      <div class="form-group mb-0">
        <label class="form-label">Full Name *</label>
        <input class="form-input" id="rb-name" value="${esc(c.name)}" placeholder="Jane Smith" />
      </div>
      <div class="form-group mb-0">
        <label class="form-label">Email *</label>
        <input class="form-input" id="rb-email" type="email" value="${esc(c.email)}" placeholder="jane@example.com" />
      </div>
      <div class="form-group mb-0">
        <label class="form-label">Phone</label>
        <input class="form-input" id="rb-phone" value="${esc(c.phone)}" placeholder="+1 555 000 0000" />
      </div>
      <div class="form-group mb-0">
        <label class="form-label">Location</label>
        <input class="form-input" id="rb-location" value="${esc(c.location)}" placeholder="City, State / Country" />
      </div>
      <div class="form-group mb-0">
        <label class="form-label">LinkedIn URL</label>
        <input class="form-input" id="rb-linkedin" value="${esc(c.linkedin)}" placeholder="linkedin.com/in/janesmith" />
      </div>
      <div class="form-group mb-0">
        <label class="form-label">GitHub / Portfolio</label>
        <input class="form-input" id="rb-github" value="${esc(c.github)}" placeholder="github.com/janesmith" />
      </div>
    </div>
  `;
}

function renderSummaryStep(summary) {
  return `
    <h3 class="rb-step-title">📝 Professional Summary</h3>
    <p class="rb-step-sub">Write 2–4 sentences that pitch your value. Include your target role, top skills, and years of experience. ATS looks for keyword density here.</p>
    <div class="form-group mb-0">
      <textarea class="form-input rb-textarea" id="rb-summary" rows="5"
        placeholder="Results-driven Software Engineer with 2+ years of experience building scalable web applications using React and Node.js. Passionate about clean code and cloud-native architectures. Seeking a challenging role at a growth-stage company..."
      >${esc(summary)}</textarea>
      <span class="form-helper" id="rb-summary-count">${summary.split(/\s+/).filter(Boolean).length} words</span>
    </div>
    <div class="rb-tip-box mt-3">
      <strong>💡 ATS tip:</strong> Include the exact job title and 3–5 keywords from the job description.
    </div>
  `;
}

function renderExperienceStep(experience) {
  const entries = experience.map((exp, i) => `
    <div class="rb-entry-block" id="rb-exp-${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
        <div style="font-weight:600;font-size:0.875rem;color:var(--text-secondary)">Experience #${i + 1}</div>
        ${i > 0 ? `<button class="btn btn-ghost btn-sm rb-remove-exp" data-idx="${i}" style="color:var(--ibm-red)">✕ Remove</button>` : ''}
      </div>
      <div class="grid grid-2 gap-3">
        <div class="form-group mb-0">
          <label class="form-label">Job Title *</label>
          <input class="form-input" data-exp="${i}" data-field="title" value="${esc(exp.title)}" placeholder="Software Engineer" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">Company *</label>
          <input class="form-input" data-exp="${i}" data-field="company" value="${esc(exp.company)}" placeholder="Acme Corp" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">Start Date</label>
          <input class="form-input" data-exp="${i}" data-field="startDate" value="${esc(exp.startDate)}" placeholder="Jan 2022" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">End Date</label>
          <input class="form-input" data-exp="${i}" data-field="endDate" value="${esc(exp.endDate)}" placeholder="Present" ${exp.current ? 'disabled' : ''} />
          <label class="form-check mt-1" style="font-size:0.8125rem">
            <input type="checkbox" data-exp="${i}" data-field="current" ${exp.current ? 'checked' : ''} />
            Currently working here
          </label>
        </div>
      </div>
      <div class="form-group mt-3 mb-0">
        <label class="form-label">Bullet Points <span style="font-weight:400;color:var(--text-secondary)">(start with an action verb; include numbers)</span></label>
        <div id="rb-exp-bullets-${i}">
          ${exp.bullets.map((b, bi) => `
            <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem">
              <input class="form-input" data-exp="${i}" data-bullet="${bi}" value="${esc(b)}"
                placeholder="• Developed a REST API that reduced latency by 40%" />
            </div>
          `).join('')}
        </div>
        <button class="btn btn-ghost btn-sm rb-add-bullet" data-exp="${i}" style="margin-top:0.25rem">+ Add bullet</button>
      </div>
    </div>
    ${i < experience.length - 1 ? '<hr style="border:none;border-top:1px solid var(--ui-03);margin:1rem 0">' : ''}
  `).join('');

  return `
    <h3 class="rb-step-title">💼 Work Experience</h3>
    <p class="rb-step-sub">List in reverse-chronological order. Use action verbs and quantify achievements where possible.</p>
    <div id="rb-exp-list">${entries}</div>
    <button class="btn btn-secondary btn-sm mt-3 w-full" id="rb-add-exp-btn">+ Add Another Position</button>
    <div class="rb-tip-box mt-3">
      <strong>💡 ATS tip:</strong> Use standard job title keywords (e.g. "Software Engineer" not "Code Wizard").
    </div>
  `;
}

function renderEducationStep(education) {
  const entries = education.map((edu, i) => `
    <div class="rb-entry-block" id="rb-edu-${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
        <div style="font-weight:600;font-size:0.875rem;color:var(--text-secondary)">Education #${i + 1}</div>
        ${i > 0 ? `<button class="btn btn-ghost btn-sm rb-remove-edu" data-idx="${i}" style="color:var(--ibm-red)">✕ Remove</button>` : ''}
      </div>
      <div class="grid grid-2 gap-3">
        <div class="form-group mb-0">
          <label class="form-label">Degree *</label>
          <input class="form-input" data-edu="${i}" data-field="degree" value="${esc(edu.degree)}" placeholder="Bachelor of Science" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">Field of Study</label>
          <input class="form-input" data-edu="${i}" data-field="field" value="${esc(edu.field)}" placeholder="Computer Science" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">Institution *</label>
          <input class="form-input" data-edu="${i}" data-field="institution" value="${esc(edu.institution)}" placeholder="MIT" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">Graduation Year</label>
          <input class="form-input" data-edu="${i}" data-field="year" value="${esc(edu.year)}" placeholder="2024" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">GPA <span style="font-weight:400;color:var(--text-secondary)">(optional)</span></label>
          <input class="form-input" data-edu="${i}" data-field="gpa" value="${esc(edu.gpa)}" placeholder="3.8 / 4.0" />
        </div>
      </div>
    </div>
    ${i < education.length - 1 ? '<hr style="border:none;border-top:1px solid var(--ui-03);margin:1rem 0">' : ''}
  `).join('');

  return `
    <h3 class="rb-step-title">🎓 Education</h3>
    <p class="rb-step-sub">List your most recent degree first.</p>
    <div id="rb-edu-list">${entries}</div>
    <button class="btn btn-secondary btn-sm mt-3 w-full" id="rb-add-edu-btn">+ Add Another Degree</button>
  `;
}

function renderSkillsStep(skills) {
  const ALL_SKILLS = [
    'Python','JavaScript','TypeScript','Java','C++','C#','Go','Rust','SQL','R',
    'React','Angular','Vue.js','Node.js','Django','Flask','Spring Boot','Next.js',
    'Machine Learning','Deep Learning','TensorFlow','PyTorch','NLP','Data Analysis',
    'AWS','Azure','Google Cloud','Docker','Kubernetes','CI/CD','Terraform','Linux','Git',
    'MySQL','PostgreSQL','MongoDB','Redis','Elasticsearch',
    'Communication','Leadership','Teamwork','Problem Solving','Agile/Scrum','Project Management',
    'Network Security','Penetration Testing','Ethical Hacking',
    'UI/UX Design','Figma','User Research',
  ];
  const selected = new Set(skills.map(s => s.toLowerCase()));

  return `
    <h3 class="rb-step-title">⚡ Skills</h3>
    <p class="rb-step-sub">Click to toggle skills, or type custom ones below. Aim for 8–16 skills.</p>

    <div style="display:flex;gap:0.5rem;margin-bottom:1rem">
      <input class="form-input" id="rb-custom-skill" placeholder="Type a custom skill…" style="flex:1" />
      <button class="btn btn-primary" id="rb-add-custom-skill">Add</button>
    </div>

    <div class="rb-skill-grid" id="rb-skill-grid">
      ${ALL_SKILLS.map(s => `
        <button class="rb-skill-toggle ${selected.has(s.toLowerCase()) ? 'selected' : ''}"
          data-skill="${esc(s)}">${s}</button>
      `).join('')}
      ${skills.filter(s => !ALL_SKILLS.map(x=>x.toLowerCase()).includes(s.toLowerCase())).map(s => `
        <button class="rb-skill-toggle selected" data-skill="${esc(s)}">${s}</button>
      `).join('')}
    </div>
    <div class="form-helper mt-2" id="rb-skill-count">${skills.length} skill${skills.length !== 1 ? 's' : ''} selected</div>
    <div class="rb-tip-box mt-3">
      <strong>💡 ATS tip:</strong> Use exact skill keywords from the job description — "Node.js" not "NodeJS".
    </div>
  `;
}

function renderProjectsStep(projects) {
  const entries = projects.map((p, i) => `
    <div class="rb-entry-block" id="rb-proj-${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
        <div style="font-weight:600;font-size:0.875rem;color:var(--text-secondary)">Project #${i + 1}</div>
        ${i > 0 ? `<button class="btn btn-ghost btn-sm rb-remove-proj" data-idx="${i}" style="color:var(--ibm-red)">✕ Remove</button>` : ''}
      </div>
      <div class="grid grid-2 gap-3">
        <div class="form-group mb-0">
          <label class="form-label">Project Name *</label>
          <input class="form-input" data-proj="${i}" data-field="name" value="${esc(p.name)}" placeholder="CareerLens AI" />
        </div>
        <div class="form-group mb-0">
          <label class="form-label">URL / GitHub</label>
          <input class="form-input" data-proj="${i}" data-field="url" value="${esc(p.url)}" placeholder="github.com/you/project" />
        </div>
      </div>
      <div class="form-group mt-3 mb-0">
        <label class="form-label">Technologies Used</label>
        <input class="form-input" data-proj="${i}" data-field="tech" value="${esc(p.tech)}" placeholder="React, Node.js, PostgreSQL, Docker" />
      </div>
      <div class="form-group mt-3 mb-0">
        <label class="form-label">Description</label>
        <textarea class="form-input rb-textarea-sm" data-proj="${i}" data-field="description" rows="3"
          placeholder="Built a full-stack web application that lets users track job applications. Reduced search time by 30% with intelligent filtering.">${esc(p.description)}</textarea>
      </div>
    </div>
    ${i < projects.length - 1 ? '<hr style="border:none;border-top:1px solid var(--ui-03);margin:1rem 0">' : ''}
  `).join('');

  return `
    <h3 class="rb-step-title">🚀 Projects</h3>
    <p class="rb-step-sub">Show real work. Include links where possible — ATS sees the keywords in descriptions.</p>
    <div id="rb-proj-list">${entries}</div>
    <button class="btn btn-secondary btn-sm mt-3 w-full" id="rb-add-proj-btn">+ Add Another Project</button>
    <div class="rb-tip-box mt-3">
      <strong>💡 ATS tip:</strong> List the tech stack in plain text — avoid icons or graphics.
    </div>
  `;
}

/* =========================================================
   BIND STEP INPUTS (live two-way binding)
   ========================================================= */
function bindStepInputs(step, data, onUpdate) {
  if (step === 0) {
    const fields = ['name','email','phone','location','linkedin','github'];
    fields.forEach(f => {
      const input = document.getElementById(`rb-${f}`);
      input?.addEventListener('input', () => { data.contact[f] = input.value; onUpdate(); });
    });
  }

  if (step === 1) {
    const ta = document.getElementById('rb-summary');
    const count = document.getElementById('rb-summary-count');
    ta?.addEventListener('input', () => {
      data.summary = ta.value;
      const wc = ta.value.trim().split(/\s+/).filter(Boolean).length;
      if (count) count.textContent = `${wc} word${wc !== 1 ? 's' : ''}`;
      onUpdate();
    });
  }

  if (step === 2) {
    _bindExpInputs(data, onUpdate);
    document.getElementById('rb-add-exp-btn')?.addEventListener('click', () => {
      collectStepData(2, data);
      data.experience.push(blankExp());
      document.getElementById('rb-step-card').innerHTML = renderStepForm(2, data);
      _bindExpInputs(data, onUpdate);
    });
  }

  if (step === 3) {
    _bindEduInputs(data, onUpdate);
    document.getElementById('rb-add-edu-btn')?.addEventListener('click', () => {
      collectStepData(3, data);
      data.education.push(blankEdu());
      document.getElementById('rb-step-card').innerHTML = renderStepForm(3, data);
      _bindEduInputs(data, onUpdate);
    });
  }

  if (step === 4) {
    _bindSkillToggles(data, onUpdate);

    const customInput = document.getElementById('rb-custom-skill');
    const addBtn = document.getElementById('rb-add-custom-skill');
    const doAdd = () => {
      const val = customInput?.value.trim();
      if (!val) return;
      if (!data.skills.map(s => s.toLowerCase()).includes(val.toLowerCase())) {
        data.skills.push(val);
      }
      if (customInput) customInput.value = '';
      document.getElementById('rb-step-card').innerHTML = renderStepForm(4, data);
      _bindSkillToggles(data, onUpdate);
      onUpdate();
    };
    addBtn?.addEventListener('click', doAdd);
    customInput?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doAdd(); } });
  }

  if (step === 5) {
    _bindProjInputs(data, onUpdate);
    document.getElementById('rb-add-proj-btn')?.addEventListener('click', () => {
      collectStepData(5, data);
      data.projects.push(blankProject());
      document.getElementById('rb-step-card').innerHTML = renderStepForm(5, data);
      _bindProjInputs(data, onUpdate);
    });
  }
}

function _bindExpInputs(data, onUpdate) {
  document.querySelectorAll('[data-exp][data-field]').forEach(input => {
    const i = parseInt(input.dataset.exp);
    const f = input.dataset.field;
    const ev = input.type === 'checkbox' ? 'change' : 'input';
    input.addEventListener(ev, () => {
      if (f === 'current') {
        data.experience[i].current = input.checked;
        const endInput = document.querySelector(`[data-exp="${i}"][data-field="endDate"]`);
        if (endInput) { endInput.disabled = input.checked; if (input.checked) { data.experience[i].endDate = 'Present'; } }
      } else {
        data.experience[i][f] = input.value;
      }
      onUpdate();
    });
  });
  document.querySelectorAll('[data-exp][data-bullet]').forEach(input => {
    const i = parseInt(input.dataset.exp);
    const bi = parseInt(input.dataset.bullet);
    input.addEventListener('input', () => { data.experience[i].bullets[bi] = input.value; onUpdate(); });
  });
  document.querySelectorAll('.rb-add-bullet').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.exp);
      collectStepData(2, data);
      data.experience[i].bullets.push('');
      document.getElementById('rb-step-card').innerHTML = renderStepForm(2, data);
      _bindExpInputs(data, onUpdate);
    });
  });
  document.querySelectorAll('.rb-remove-exp').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      collectStepData(2, data);
      data.experience.splice(i, 1);
      document.getElementById('rb-step-card').innerHTML = renderStepForm(2, data);
      _bindExpInputs(data, onUpdate);
      onUpdate();
    });
  });
}

function _bindEduInputs(data, onUpdate) {
  document.querySelectorAll('[data-edu][data-field]').forEach(input => {
    const i = parseInt(input.dataset.edu);
    const f = input.dataset.field;
    input.addEventListener('input', () => { data.education[i][f] = input.value; onUpdate(); });
  });
  document.querySelectorAll('.rb-remove-edu').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      collectStepData(3, data);
      data.education.splice(i, 1);
      document.getElementById('rb-step-card').innerHTML = renderStepForm(3, data);
      _bindEduInputs(data, onUpdate);
      onUpdate();
    });
  });
}

function _bindSkillToggles(data, onUpdate) {
  document.querySelectorAll('.rb-skill-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const skill = btn.dataset.skill;
      const idx = data.skills.findIndex(s => s.toLowerCase() === skill.toLowerCase());
      if (idx === -1) { data.skills.push(skill); btn.classList.add('selected'); }
      else { data.skills.splice(idx, 1); btn.classList.remove('selected'); }
      const counter = document.getElementById('rb-skill-count');
      if (counter) counter.textContent = `${data.skills.length} skill${data.skills.length !== 1 ? 's' : ''} selected`;
      onUpdate();
    });
  });
}

function _bindProjInputs(data, onUpdate) {
  document.querySelectorAll('[data-proj][data-field]').forEach(input => {
    const i = parseInt(input.dataset.proj);
    const f = input.dataset.field;
    input.addEventListener('input', () => { data.projects[i][f] = input.value; onUpdate(); });
  });
  document.querySelectorAll('.rb-remove-proj').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      collectStepData(5, data);
      data.projects.splice(i, 1);
      document.getElementById('rb-step-card').innerHTML = renderStepForm(5, data);
      _bindProjInputs(data, onUpdate);
      onUpdate();
    });
  });
}

/* =========================================================
   COLLECT STEP DATA (read DOM → data)
   ========================================================= */
function collectStepData(step, data) {
  if (step === 0) {
    ['name','email','phone','location','linkedin','github'].forEach(f => {
      const el = document.getElementById(`rb-${f}`);
      if (el) data.contact[f] = el.value;
    });
  }
  if (step === 1) {
    const ta = document.getElementById('rb-summary');
    if (ta) data.summary = ta.value;
  }
  if (step === 2) {
    document.querySelectorAll('[data-exp][data-field]').forEach(input => {
      const i = parseInt(input.dataset.exp);
      const f = input.dataset.field;
      if (f === 'current') data.experience[i].current = input.checked;
      else data.experience[i][f] = input.value;
    });
    document.querySelectorAll('[data-exp][data-bullet]').forEach(input => {
      const i = parseInt(input.dataset.exp);
      const bi = parseInt(input.dataset.bullet);
      data.experience[i].bullets[bi] = input.value;
    });
  }
  if (step === 3) {
    document.querySelectorAll('[data-edu][data-field]').forEach(input => {
      const i = parseInt(input.dataset.edu);
      const f = input.dataset.field;
      data.education[i][f] = input.value;
    });
  }
  if (step === 4) {
    // skills are toggled directly — no DOM collection needed
  }
  if (step === 5) {
    document.querySelectorAll('[data-proj][data-field]').forEach(input => {
      const i = parseInt(input.dataset.proj);
      const f = input.dataset.field;
      data.projects[i][f] = input.value;
    });
  }
}

/* =========================================================
   LIVE RESUME HTML (ATS-clean single-column template)
   ========================================================= */
function renderResumeHTML(d) {
  const c = d.contact;
  const hasContent = c.name || d.summary || d.experience.some(e => e.title) || d.education.some(e => e.degree);

  if (!hasContent) {
    return `<div class="rb-preview-empty">
      <div style="font-size:2rem;margin-bottom:0.75rem">📄</div>
      <div style="color:var(--text-secondary);font-size:0.9rem">Fill in the form on the left to see your resume preview here.</div>
    </div>`;
  }

  const contactLine = [c.email, c.phone, c.location].filter(Boolean).join(' · ');
  const linksLine   = [c.linkedin, c.github].filter(Boolean).join(' · ');

  const expHTML = d.experience.filter(e => e.title || e.company).map(e => `
    <div class="rb-res-entry">
      <div class="rb-res-entry-header">
        <span class="rb-res-entry-title">${esc(e.title)}${e.company ? ` — ${esc(e.company)}` : ''}</span>
        <span class="rb-res-entry-date">${[e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ')}</span>
      </div>
      ${e.bullets.filter(Boolean).length > 0
        ? `<ul class="rb-res-bullets">${e.bullets.filter(Boolean).map(b => `<li>${esc(b.replace(/^[•\-]\s*/,''))}</li>`).join('')}</ul>`
        : ''}
    </div>
  `).join('');

  const eduHTML = d.education.filter(e => e.degree || e.institution).map(e => `
    <div class="rb-res-entry">
      <div class="rb-res-entry-header">
        <span class="rb-res-entry-title">${[e.degree, e.field].filter(Boolean).join(', ')}</span>
        <span class="rb-res-entry-date">${esc(e.year)}</span>
      </div>
      <div class="rb-res-entry-sub">${esc(e.institution)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ''}</div>
    </div>
  `).join('');

  const skillsHTML = d.skills.length > 0
    ? d.skills.join(' · ')
    : '';

  const projHTML = d.projects.filter(p => p.name).map(p => `
    <div class="rb-res-entry">
      <div class="rb-res-entry-header">
        <span class="rb-res-entry-title">${esc(p.name)}</span>
        ${p.url ? `<span class="rb-res-entry-date" style="font-size:0.7rem">${esc(p.url)}</span>` : ''}
      </div>
      ${p.tech ? `<div class="rb-res-entry-sub" style="margin-bottom:4px">Technologies: ${esc(p.tech)}</div>` : ''}
      ${p.description ? `<div class="rb-res-proj-desc">${esc(p.description)}</div>` : ''}
    </div>
  `).join('');

  return `
    <div class="rb-resume-doc" id="rb-resume-doc">
      <!-- Name & Contact Header -->
      <div class="rb-res-header">
        <div class="rb-res-name">${esc(c.name) || 'Your Name'}</div>
        ${contactLine ? `<div class="rb-res-contact">${contactLine}</div>` : ''}
        ${linksLine   ? `<div class="rb-res-contact">${linksLine}</div>` : ''}
      </div>

      <!-- Summary -->
      ${d.summary ? `
        <div class="rb-res-section">
          <div class="rb-res-section-title">PROFESSIONAL SUMMARY</div>
          <div class="rb-res-section-line"></div>
          <p class="rb-res-summary">${esc(d.summary)}</p>
        </div>
      ` : ''}

      <!-- Experience -->
      ${expHTML ? `
        <div class="rb-res-section">
          <div class="rb-res-section-title">EXPERIENCE</div>
          <div class="rb-res-section-line"></div>
          ${expHTML}
        </div>
      ` : ''}

      <!-- Education -->
      ${eduHTML ? `
        <div class="rb-res-section">
          <div class="rb-res-section-title">EDUCATION</div>
          <div class="rb-res-section-line"></div>
          ${eduHTML}
        </div>
      ` : ''}

      <!-- Skills -->
      ${skillsHTML ? `
        <div class="rb-res-section">
          <div class="rb-res-section-title">SKILLS</div>
          <div class="rb-res-section-line"></div>
          <p class="rb-res-skills-list">${skillsHTML}</p>
        </div>
      ` : ''}

      <!-- Projects -->
      ${projHTML ? `
        <div class="rb-res-section">
          <div class="rb-res-section-title">PROJECTS</div>
          <div class="rb-res-section-line"></div>
          ${projHTML}
        </div>
      ` : ''}
    </div>
  `;
}

/* =========================================================
   ATS SCORE
   ========================================================= */
function renderATSScore(d) {
  const checks = [
    {
      label: 'Contact info complete',
      pass: !!(d.contact.name && d.contact.email),
      tip: 'Name and email are required.',
    },
    {
      label: 'Professional summary present',
      pass: d.summary.trim().split(/\s+/).filter(Boolean).length >= 20,
      tip: 'Write at least 20 words in your summary.',
    },
    {
      label: 'Work experience listed',
      pass: d.experience.some(e => e.title && e.company),
      tip: 'Add at least one work or internship entry.',
    },
    {
      label: 'Experience has bullet points',
      pass: d.experience.some(e => e.bullets.filter(Boolean).length >= 1),
      tip: 'Add accomplishment bullet points to each role.',
    },
    {
      label: '8+ skills listed',
      pass: d.skills.length >= 8,
      tip: 'List at least 8 relevant skills for ATS keyword matching.',
    },
    {
      label: 'Education section filled',
      pass: d.education.some(e => e.degree && e.institution),
      tip: 'Add your highest degree and institution.',
    },
    {
      label: 'LinkedIn or GitHub included',
      pass: !!(d.contact.linkedin || d.contact.github),
      tip: 'Professional links significantly improve recruiter response.',
    },
    {
      label: 'Projects section present',
      pass: d.projects.some(p => p.name && p.description),
      tip: 'Show real work with a project description.',
    },
  ];

  const passed = checks.filter(c => c.pass).length;
  const pct    = Math.round((passed / checks.length) * 100);
  const color  = pct >= 80 ? 'var(--ibm-green)' : pct >= 50 ? 'var(--ibm-orange)' : 'var(--ibm-red)';
  const label  = pct >= 80 ? 'ATS Ready' : pct >= 50 ? 'Needs Work' : 'Low Score';

  return `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
      <div style="font-size:2rem;font-weight:700;color:${color}">${pct}%</div>
      <div>
        <div style="font-weight:600;color:${color}">${label}</div>
        <div style="font-size:0.8125rem;color:var(--text-secondary)">${passed} / ${checks.length} checks passed</div>
      </div>
      <div style="flex:1">
        <div class="progress-bar-wrap" style="margin-top:0">
          <div class="progress-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>
    </div>
    ${checks.map(c => `
      <div class="rb-ats-row">
        <span class="rb-ats-icon">${c.pass ? '✅' : '⭕'}</span>
        <div class="rb-ats-label">${c.label}</div>
        ${!c.pass ? `<div class="rb-ats-tip">${c.tip}</div>` : ''}
      </div>
    `).join('')}
  `;
}

/* =========================================================
   DOWNLOAD PDF
   ========================================================= */
function downloadPDF() {
  window.print();
}

/* =========================================================
   DOWNLOAD DOCX
   Generates a Word-compatible HTML document as a .docx blob.
   ========================================================= */
function downloadDOCX(d) {
  const c = d.contact;
  const contactLine = [c.email, c.phone, c.location].filter(Boolean).join(' | ');
  const linksLine   = [c.linkedin, c.github].filter(Boolean).join(' | ');

  const expRows = d.experience.filter(e => e.title || e.company).map(e => `
    <p style="margin:6pt 0 2pt;font-weight:bold;font-size:11pt">${esc(e.title)}${e.company ? ` — ${esc(e.company)}` : ''}<span style="float:right;font-weight:normal;font-size:10pt">${[e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' – ')}</span></p>
    ${e.bullets.filter(Boolean).map(b => `<p style="margin:1pt 0 1pt 16pt;font-size:10pt">• ${esc(b.replace(/^[•\-]\s*/,''))}</p>`).join('')}
  `).join('');

  const eduRows = d.education.filter(e => e.degree || e.institution).map(e => `
    <p style="margin:6pt 0 2pt;font-weight:bold;font-size:11pt">${[e.degree, e.field].filter(Boolean).join(', ')}<span style="float:right;font-weight:normal;font-size:10pt">${esc(e.year)}</span></p>
    <p style="margin:0 0 2pt;font-size:10pt;color:#555">${esc(e.institution)}${e.gpa ? ` · GPA: ${esc(e.gpa)}` : ''}</p>
  `).join('');

  const projRows = d.projects.filter(p => p.name).map(p => `
    <p style="margin:6pt 0 2pt;font-weight:bold;font-size:11pt">${esc(p.name)}${p.url ? ` <span style="font-weight:normal;font-size:9pt;color:#555">| ${esc(p.url)}</span>` : ''}</p>
    ${p.tech ? `<p style="margin:0;font-size:10pt;color:#555">Technologies: ${esc(p.tech)}</p>` : ''}
    ${p.description ? `<p style="margin:2pt 0;font-size:10pt">${esc(p.description)}</p>` : ''}
  `).join('');

  const sectionHeader = (title) => `
    <p style="margin:12pt 0 2pt;font-size:11pt;font-weight:bold;text-transform:uppercase;border-bottom:1pt solid #000;padding-bottom:2pt;letter-spacing:0.05em">${title}</p>
  `;

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8">
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #111; margin: 1in; }
    </style>
    </head><body>
      <p style="font-size:20pt;font-weight:bold;margin:0 0 2pt;text-align:center">${esc(c.name) || 'Your Name'}</p>
      ${contactLine ? `<p style="font-size:10pt;margin:2pt 0;text-align:center;color:#555">${contactLine}</p>` : ''}
      ${linksLine   ? `<p style="font-size:10pt;margin:2pt 0;text-align:center;color:#555">${linksLine}</p>` : ''}

      ${d.summary ? `${sectionHeader('Professional Summary')}<p style="font-size:10pt;margin:4pt 0">${esc(d.summary)}</p>` : ''}
      ${expRows ? `${sectionHeader('Experience')}${expRows}` : ''}
      ${eduRows ? `${sectionHeader('Education')}${eduRows}` : ''}
      ${d.skills.length > 0 ? `${sectionHeader('Skills')}<p style="font-size:10pt;margin:4pt 0">${d.skills.join(' · ')}</p>` : ''}
      ${projRows ? `${sectionHeader('Projects')}${projRows}` : ''}
    </body></html>
  `;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/vnd.ms-word;charset=utf-8',
  });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${(c.name || 'resume').replace(/\s+/g, '_')}_resume.docx`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('DOCX downloaded!', 'success');
}

/* =========================================================
   ACHIEVEMENT TRIGGER
   ========================================================= */
function _fireAchievements(appState) {
  // Treat completing the builder as a resume analysis event
  // so the resume-uploaded badge can fire
  if (!appState.profile) {
    appState.profile = {
      name: appState.resumeBuilder?.contact?.name || 'Student',
      skills: appState.resumeBuilder?.skills || [],
      skillsByCategory: {},
      experience: 0,
      education: appState.resumeBuilder?.education?.[0]?.degree || null,
      resumeScore: 60,
      wordCount: 300,
      contact: { ...appState.resumeBuilder?.contact },
      analyzedAt: new Date().toISOString(),
    };
  }
  updateStreak(appState);
  saveState();
  const earned = evaluateAchievements(appState);
  if (earned.length > 0) {
    saveState();
    const badge = document.getElementById('achievements-sidebar-badge');
    if (badge) badge.textContent = (appState.badges || []).length;
    earned.forEach(b => showToast(`🏅 Badge Unlocked: ${b.icon} ${b.name} (+${b.xp} XP)`, 'success', 4000));
  }
}

/* ── Utility ──────────────────────────────────────────── */
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
