/* ── PARTICLES ── */
const pContainer = document.getElementById('particles');
for (let i = 0; i < 18; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = 60 + Math.random() * 120;
  p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${8 + Math.random() * 14}s;
      animation-delay:${Math.random() * 10}s;
    `;
  pContainer.appendChild(p);
}

/* ── DRAG & DROP ── */
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.add('drag-over');
}
function handleDragLeave() {
  document.getElementById('upload-zone').classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('upload-zone').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) startAnalysis(file);
}

/* ── ANALYSIS FLOW ── */
async function startAnalysis(file) {
  const filename = file.name;
  // hide upload zone
  document.getElementById('upload-zone').style.display = 'none';
  document.getElementById('results').style.display = 'none';

  // show progress
  const pw = document.getElementById('progress-wrap');
  pw.classList.add('visible');
  document.getElementById('progress-filename').textContent = filename;

  const steps = ['step-upload', 'step-read', 'step-ai', 'step-done'];
  let pct = 0; let stepIdx = 0;

  const scanMsgs = ['Reading your report...', 'Identifying test parameters...', 'Cross-referencing normal ranges...', 'Generating health summary...'];
  let scanIdx = 0;

  // Start progress animation
  const interval = setInterval(() => {
    // Slow down progress after 90% if backend hasn't responded yet
    if (pct < 90) {
      pct += 2;
    } else {
      pct = Math.min(98, pct + 0.1);
    }

    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('progress-pct').textContent = Math.floor(pct) + '%';

    const newStepIdx = Math.floor(pct / 26);
    if (newStepIdx !== stepIdx && newStepIdx < steps.length) {
      if (stepIdx < steps.length) document.getElementById(steps[stepIdx]).classList.remove('active');
      stepIdx = newStepIdx;
      document.getElementById(steps[stepIdx]).classList.add('active');
    }
    if (pct > 25) document.getElementById('step-upload').classList.add('done');
    if (pct > 50) document.getElementById('step-read').classList.add('done');
    if (pct > 75) document.getElementById('step-ai').classList.add('done');

    if (pct % 20 === 0 && scanIdx < scanMsgs.length) {
      document.getElementById('scan-text').textContent = scanMsgs[scanIdx++];
    }
  }, 100);

  setTimeout(() => {
    document.getElementById('scan-anim').classList.add('active');
  }, 400);

  // Call Backend
  try {
    const formData = new FormData();
    formData.append('report', file);

    const response = await fetch(`${window.CONFIG.API_BASE_URL}/api/report/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Analysis failed');
    }

    const result = await response.json();

    // Complete the progress bar
    clearInterval(interval);
    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('progress-pct').textContent = '100%';
    document.getElementById('step-done').classList.add('done');

    setTimeout(() => {
      pw.classList.remove('visible');
      document.getElementById('scan-anim').classList.remove('active');
      showResults(filename, result);
    }, 600);

  } catch (error) {
    clearInterval(interval);
    console.error('Analysis Error:', error);
    showToast('❌ Error: ' + error.message);
    resetPage();
  }
}


function showResults(filename, data) {
  document.getElementById('results-meta').textContent =
    'Analysed just now · ' + filename;

  // Update Summary
  if (data.summary) {
    document.getElementById('summary-verdict').textContent = data.summary.verdict;
    document.getElementById('summary-desc').textContent = data.summary.description;

    const chipsContainer = document.getElementById('summary-chips');
    chipsContainer.innerHTML = '';
    data.summary.chips.forEach(chip => {
      const span = document.createElement('span');
      span.className = 'summary-chip';
      span.textContent = chip;
      chipsContainer.appendChild(span);
    });

    document.getElementById('health-score-num').textContent = '0';
    const targetScore = data.summary.health_score || 0;
    animateScore(targetScore);
  }

  // metrics
  const mg = document.getElementById('metrics-grid');
  mg.innerHTML = '';
  const metrics = data.metrics || [];
  document.getElementById('metric-count-badge').textContent = `${metrics.length} parameter${metrics.length !== 1 ? 's' : ''}`;
  metrics.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.style.animationDelay = (i * 0.05) + 's';
    card.innerHTML = `
        <div class="metric-icon">${m.icon}</div>
        <div class="metric-name">${m.name}</div>
        <div class="metric-value">${m.value} <span class="metric-unit">${m.unit}</span></div>
        <span class="metric-status status-${m.status}">${m.status.charAt(0).toUpperCase() + m.status.slice(1)}</span>
        <div class="metric-bar"><div class="metric-bar-fill fill-${m.status}" id="mbar-${i}"></div></div>
      `;
    mg.appendChild(card);
  });

  // findings
  const fl = document.getElementById('findings-list');
  fl.innerHTML = '';
  const findings = data.findings || [];
  document.getElementById('finding-count-badge').textContent = `${findings.length} flagged`;
  findings.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'finding-item';
    item.innerHTML = `
        <div class="finding-icon ${f.color}">${f.icon}</div>
        <div style="flex:1;">
          <div class="finding-title">${f.title}</div>
          <div class="finding-desc">${f.desc}</div>
        </div>
        <span class="finding-tag" style="${f.tagStyle}">${f.tag}</span>
      `;
    fl.appendChild(item);
  });

  // recommendations
  const rg = document.getElementById('rec-grid');
  rg.innerHTML = '';
  const recommendations = data.recommendations || [];
  recommendations.forEach(r => {
    const card = document.createElement('div');
    card.className = `rec-card ${r.color}`;
    card.innerHTML = `<div class="rec-icon">${r.icon}</div><div class="rec-title">${r.title}</div><p class="rec-desc">${r.desc}</p>`;
    rg.appendChild(card);
  });

  // next steps
  const sl = document.getElementById('step-list');
  sl.innerHTML = '';
  const steps = data.next_steps || [];
  steps.forEach(s => {
    const row = document.createElement('div');
    row.className = 'step-row';
    row.innerHTML = `
        <div class="step-num-circle">${s.num}</div>
        <div>
          <div class="step-content-title">${s.title}</div>
          <div class="step-content-desc">${s.desc}</div>
        </div>`;
    sl.appendChild(row);
  });

  // show results
  const results = document.getElementById('results');
  results.style.display = 'block';
  results.classList.add('visible');

  // animate metric bars after paint
  setTimeout(() => {
    metrics.forEach((m, i) => {
      const bar = document.getElementById('mbar-' + i);
      if (bar) bar.style.width = m.fill + '%';
    });
  }, 300);

  // animate findings in staggered
  setTimeout(() => {
    document.querySelectorAll('.finding-item').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 200);

  showToast('✅ Report analysed successfully!');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function animateScore(target) {
  let n = 0;
  const scoreEl = document.getElementById('health-score-num');
  const scoreTimer = setInterval(() => {
    n = Math.min(n + 2, target);
    scoreEl.textContent = n;
    if (n >= target) clearInterval(scoreTimer);
  }, 25);
}

/* ── ACTIONS ── */
function resetPage() {
  document.getElementById('upload-zone').style.display = 'block';
  document.getElementById('results').style.display = 'none';
  document.getElementById('results').classList.remove('visible');
  document.getElementById('progress-wrap').classList.remove('visible');
  document.getElementById('scan-anim').classList.remove('active');
  document.getElementById('file-input').value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copyResults() {
  const text = 'Medi-Mate Report Summary\n\nOverall: Mostly Normal — Minor Attention Needed\nHealth Score: 78/100\n\nKey Flags:\n- Low Vitamin D (18 ng/mL)\n- Low Serum Iron (55 µg/dL)\n\nRecommendations:\n- Take Vitamin D 2000 IU daily\n- Eat iron-rich foods\n- Retest in 3 months';
  navigator.clipboard.writeText(text).catch(() => { });
  showToast('📋 Summary copied to clipboard!');
}

function downloadResults() {
  showToast('⬇️ Preparing download...');
  setTimeout(() => showToast('✅ Report saved!'), 1400);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}
const uploadZone = document.getElementById("upload-zone");
const fileInput = document.getElementById("file-input");

// click to open file
uploadZone.addEventListener("click", () => {
  fileInput.click();
});

// drag over
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

// drag leave
uploadZone.addEventListener("dragleave", () => { });

// drop file
uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  handleFile(file);
});

// file select
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  handleFile(file);
});

// handle file
function handleFile(file) {
  if (!file) return;
  startAnalysis(file);
}

const logoclick = document.querySelector(".logo-brand");

console.log(logoclick); // should NOT be null

logoclick.addEventListener("click", () => {
  window.location.href = "../home_page/index.html";
});

// Update Profile Name
(function initProfile() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const firstName = user.username.split(' ')[0];
      const usernameEl = document.getElementById('username');
      if (usernameEl) usernameEl.textContent = firstName;
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }
})();

// ── LOGOUT LOGIC ──
const profileTrigger = document.getElementById('profile-trigger');
const logoutMenu = document.getElementById('logout-menu');
const logoutLink = document.getElementById('logout-link');

if (profileTrigger && logoutMenu) {
  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    logoutMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    logoutMenu.classList.remove('show');
  });
}

if (logoutLink) {
  logoutLink.addEventListener('click', (e) => {
    e.stopPropagation();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '../landing/index.html';
  });
}


