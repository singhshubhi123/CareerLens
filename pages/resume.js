/* =========================================================
   Resume Analyzer Page
   ========================================================= */
import { navigateTo, saveState, showToast, el } from '../js/app.js';
import { analyzeResume, DEMO_RESUME } from '../js/analyzer.js';

export function render(appState) {
  const container = el('div', { className: 'animate-in' });

  container.innerHTML = `
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
          >${appState.profile ? getStoredResumeText() : ''}</textarea>
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
              ${renderManualSkills(appState)}
            </div>
          </div>
        </div>
      </div>

      <!-- Results Panel -->
      <div id="results-panel">
        ${appState.profile ? renderResultsHTML(appState.profile) : renderEmptyResults()}
      </div>
    </div>
  `;

  return container;
}

export function onMount(appState) {
  const textarea = document.getElementById('resume-text');
  const charCount = document.getElementById('char-count');
  const analyzeBtn = document.getElementById('analyze-btn');
  const demoBtn = document.getElementById('demo-btn');
  const uploadZone = document.getElementById('upload-zone');
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  const addSkillBtn = document.getElementById('add-skill-btn');
  const manualSkillInput = document.getElementById('manual-skill');

  // Word count
  textarea?.addEventListener('input', () => {
    const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
    charCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  });

  // Demo
  demoBtn?.addEventListener('click', () => {
    textarea.value = DEMO_RESUME;
    const words = DEMO_RESUME.trim().split(/\s+/).length;
    charCount.textContent = `${words} words`;
    showToast('Demo resume loaded!', 'info');
  });

  // Upload zone drag & drop
  uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone?.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) readFileContent(file, textarea, charCount);
  });

  uploadBtn?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', () => {
    if (fileInput.files[0]) readFileContent(fileInput.files[0], textarea, charCount);
  });

  // Analyze
  analyzeBtn?.addEventListener('click', () => {
    const text = textarea?.value || '';
    if (text.trim().length < 30) {
      showToast('Please enter more resume text (at least 30 characters)', 'warning');
      return;
    }
    runAnalysis(text, appState);
  });

  // Manual skill add
  addSkillBtn?.addEventListener('click', () => addManualSkill(appState));
  manualSkillInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') addManualSkill(appState);
  });
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function showUploadStatus(message, isError = false) {
  const el = document.getElementById('upload-status');
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML = `
    <div class="upload-status-banner ${isError ? 'upload-status-error' : 'upload-status-success'}">
      <span>${isError ? '⚠️' : '✅'}</span>
      <span>${message}</span>
    </div>
  `;
}

function hideUploadStatus() {
  const el = document.getElementById('upload-status');
  if (el) el.style.display = 'none';
}

function readFileContent(file, textarea, charCount) {
  // Size guard
  if (file.size > MAX_FILE_SIZE) {
    showUploadStatus(`"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`, true);
    showToast('File too large — max 5 MB allowed.', 'error');
    return;
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

  if (isTxt) {
    hideUploadStatus();
    const reader = new FileReader();
    reader.onload = e => {
      textarea.value = e.target.result;
      const words = e.target.result.trim().split(/\s+/).filter(Boolean).length;
      charCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
      showUploadStatus(`"${file.name}" loaded successfully (${words} words).`);
      showToast(`${file.name} loaded!`, 'success');
    };
    reader.onerror = () => {
      showUploadStatus(`Could not read "${file.name}". Please try again.`, true);
      showToast('Failed to read the file.', 'error');
    };
    reader.readAsText(file);
  } else if (isPdf) {
    hideUploadStatus();
    extractPdfText(file).then(text => {
      if (!text || text.trim().length < 20) {
        showUploadStatus(`"${file.name}" could not be read — the PDF may be image-based or password-protected. Please paste the text manually.`, true);
        showToast('Could not extract text from PDF. Try pasting text manually.', 'warning', 5000);
        return;
      }
      textarea.value = text;
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      charCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
      showUploadStatus(`"${file.name}" uploaded and text extracted successfully (${words} words).`);
      showToast(`${file.name} loaded — ${words} words extracted!`, 'success');
    }).catch(err => {
      showUploadStatus(`Failed to parse "${file.name}": ${err.message}. Please paste the text manually.`, true);
      showToast('PDF parsing failed. Please paste the text manually.', 'error', 5000);
    });
  } else {
    const isDocx = file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx');
    if (isDocx) {
      showUploadStatus(`DOCX files cannot be read directly. Please open "${file.name}" in Word, copy all the text, and paste it into the text area below.`, false);
      showToast('For DOCX files, please paste the text content directly. Copy text from your Word document and paste it.', 'info', 5000);
    } else {
      showUploadStatus(`Unsupported file type. Please upload a PDF (.pdf), Word (.docx), or plain text (.txt) file.`, true);
      showToast('Unsupported file type — PDF, DOCX, and TXT are accepted.', 'error');
    }
  }
}

async function extractPdfText(file) {
  // Load pdfjs-dist from the installed npm package (Vite resolves this locally)
  const pdfjsLib = await import('pdfjs-dist');

  // Point the worker at the installed package's worker file.
  // Vite resolves `new URL('…', import.meta.url)` to a proper asset URL at build time.
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  const pageTexts = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Join items with a space; add newline between lines by checking y-position changes
    const lines = [];
    let lastY = null;
    for (const item of content.items) {
      if ('str' in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          lines.push('\n');
        }
        lines.push(item.str);
        lastY = item.transform[5];
      }
    }
    pageTexts.push(lines.join(' '));
  }
  return pageTexts.join('\n');
}

function runAnalysis(text, appState) {
  const btn = document.getElementById('analyze-btn');
  if (!btn) return;

  btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:3px"></span> Analyzing…';
  btn.disabled = true;

  // Store raw text for later
  sessionStorage.setItem('resumeText', text);

  setTimeout(() => {
    try {
      const profile = analyzeResume(text);

      // Merge any manually added skills
      if (appState.profile?.skills) {
        const existing = new Set(profile.skills.map(s => s.toLowerCase()));
        const manual = appState.profile.skills.filter(s => !existing.has(s.toLowerCase()));
        profile.skills = [...profile.skills, ...manual];
      }

      appState.profile = profile;
      saveState();

      const resultsPanel = document.getElementById('results-panel');
      if (resultsPanel) {
        resultsPanel.innerHTML = renderResultsHTML(profile);
      }

      refreshManualSkills(appState);

      btn.innerHTML = '✅ Analysis Complete!';
      btn.style.background = 'var(--ibm-green)';
      showToast(`Found ${profile.skills.length} skills! Redirecting to dashboard…`, 'success');

      setTimeout(() => {
        btn.innerHTML = '🔍 Analyze Resume';
        btn.style.background = '';
        btn.disabled = false;
        navigateTo('skills');
      }, 1800);
    } catch (err) {
      btn.innerHTML = '🔍 Analyze Resume';
      btn.disabled = false;
      showToast('Analysis failed: ' + err.message, 'error');
    }
  }, 800); // Simulate async AI analysis
}

function addManualSkill(appState) {
  const input = document.getElementById('manual-skill');
  if (!input) return;
  const skill = input.value.trim();
  if (!skill) return;

  if (!appState.profile) {
    appState.profile = { name: 'Student', skills: [], skillsByCategory: {}, experience: 0, education: null, resumeScore: 0, wordCount: 0, contact: {}, analyzedAt: new Date().toISOString() };
  }

  const existing = appState.profile.skills.map(s => s.toLowerCase());
  if (!existing.includes(skill.toLowerCase())) {
    appState.profile.skills.push(skill);
    saveState();
    refreshManualSkills(appState);
    showToast(`"${skill}" added to your skills!`, 'success');
  } else {
    showToast(`"${skill}" is already in your profile`, 'warning');
  }
  input.value = '';
}

function refreshManualSkills(appState) {
  const list = document.getElementById('manual-skills-list');
  if (list) list.innerHTML = renderManualSkills(appState);

  // Re-bind remove buttons
  document.querySelectorAll('.skill-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const skill = btn.dataset.skill;
      if (appState.profile) {
        appState.profile.skills = appState.profile.skills.filter(s => s !== skill);
        saveState();
        refreshManualSkills(appState);
      }
    });
  });
}

function renderManualSkills(appState) {
  const skills = appState.profile?.skills || [];
  if (skills.length === 0) return '<p style="color:var(--text-secondary);font-size:0.8125rem">No skills added yet</p>';
  return skills.map(s => `
    <span class="skill-chip strong">
      ${s}
      <button class="skill-remove-btn" data-skill="${s}" style="background:none;border:none;cursor:pointer;color:inherit;font-size:0.9rem;padding:0;margin-left:2px">×</button>
    </span>
  `).join('');
}

function renderResultsHTML(profile) {
  const scoreColor = profile.resumeScore >= 70 ? 'var(--ibm-green)' : profile.resumeScore >= 45 ? 'var(--ibm-orange)' : 'var(--ibm-red)';
  const scoreLabel = profile.resumeScore >= 70 ? 'Strong' : profile.resumeScore >= 45 ? 'Good' : 'Needs Work';

  return `
    <!-- Profile Card -->
    <div class="card mb-4">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--ibm-blue);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:#fff;flex-shrink:0">
          ${profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style="font-size:1.125rem;font-weight:600">${profile.name}</div>
          <div style="font-size:0.8125rem;color:var(--text-secondary)">${profile.education || 'Education not detected'} · ${profile.experience} yr${profile.experience !== 1 ? 's' : ''} exp</div>
        </div>
        <div style="margin-left:auto;text-align:center">
          <div style="font-size:1.75rem;font-weight:700;color:${scoreColor}">${profile.resumeScore}</div>
          <div style="font-size:0.7rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.05em">Resume Score</div>
          <div style="font-size:0.75rem;font-weight:600;color:${scoreColor}">${scoreLabel}</div>
        </div>
      </div>

      ${profile.contact.email || profile.contact.linkedin ? `
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;font-size:0.8rem;color:var(--text-secondary)">
          ${profile.contact.email ? `<span>✉️ ${profile.contact.email}</span>` : ''}
          ${profile.contact.phone ? `<span>📞 ${profile.contact.phone}</span>` : ''}
          ${profile.contact.linkedin ? `<span>💼 ${profile.contact.linkedin}</span>` : ''}
          ${profile.contact.github ? `<span>🐙 ${profile.contact.github}</span>` : ''}
        </div>
      ` : ''}
    </div>

    <!-- Skills by Category -->
    <div class="card mb-4">
      <div class="card-header">
        <div class="card-title">⚡ Detected Skills (${profile.skills.length})</div>
        <span class="tag tag-green">${profile.skills.length} found</span>
      </div>
      ${Object.keys(profile.skillsByCategory).length > 0
        ? Object.entries(profile.skillsByCategory).map(([key, cat]) => `
          <div class="extracted-section">
            <div style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:0.5rem">${cat.label}</div>
            <div class="skill-tag-list">
              ${cat.skills.map(s => `<span class="skill-chip strong">${s}</span>`).join('')}
            </div>
          </div>
        `).join('')
        : '<p style="color:var(--text-secondary)">No skills detected. Try the demo resume or add skills manually.</p>'
      }
    </div>

    <!-- Resume Tips -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">💡 Resume Improvement Tips</div>
      </div>
      ${getResumeTips(profile).map(tip => `
        <div style="display:flex;gap:0.75rem;padding:0.625rem 0;border-bottom:1px solid var(--ui-03);">
          <span>${tip.icon}</span>
          <div>
            <div style="font-size:0.875rem;font-weight:500">${tip.title}</div>
            <div style="font-size:0.8125rem;color:var(--text-secondary);margin-top:2px">${tip.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <button class="btn btn-primary w-full mt-4" onclick="window._navigateTo('skills')">
      View Skill Gaps Analysis →
    </button>
  `;
}

function renderEmptyResults() {
  return `
    <div class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>Analysis Results Will Appear Here</h3>
      <p>Paste your resume text and click "Analyze Resume" to see your profile, skills, and improvement suggestions.</p>
    </div>
  `;
}

function getResumeTips(profile) {
  const tips = [];
  if (!profile.contact.email) tips.push({ icon: '✉️', title: 'Add email address', desc: 'Include a professional email so recruiters can contact you.' });
  if (!profile.contact.linkedin) tips.push({ icon: '💼', title: 'Add LinkedIn URL', desc: 'A LinkedIn profile URL increases your credibility significantly.' });
  if (!profile.contact.github) tips.push({ icon: '🐙', title: 'Add GitHub profile', desc: 'Show your portfolio — GitHub profiles are highly valued in tech.' });
  if (profile.skills.length < 10) tips.push({ icon: '⚡', title: 'Add more technical skills', desc: 'Aim for 12–20 relevant skills to improve ATS matching.' });
  if (profile.wordCount < 300) tips.push({ icon: '📝', title: 'Expand resume content', desc: 'Your resume seems short. Add more details about projects and achievements.' });
  if (profile.experience === 0) tips.push({ icon: '💼', title: 'Add work/internship experience', desc: 'Include internships, freelance work, or academic projects.' });
  if (tips.length === 0) tips.push({ icon: '✅', title: 'Good resume structure!', desc: 'Your resume has all key sections. Focus on quantifying your achievements.' });
  tips.push({ icon: '🎯', title: 'Tailor for each job', desc: "Customize your resume's keywords to match each job description for better ATS scores." });
  return tips.slice(0, 5);
}

function getStoredResumeText() {
  return sessionStorage.getItem('resumeText') || '';
}
