 /* ── PARTICLES ── */
  const pContainer = document.getElementById('particles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 60 + Math.random() * 120;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${8+Math.random()*14}s;
      animation-delay:${Math.random()*10}s;
    `;
    pContainer.appendChild(p);
  }

  /* ── SAMPLE DATA ── */
  const sampleMetrics = [
    { icon:'🩸', name:'Haemoglobin', value:'13.8', unit:'g/dL', status:'normal',   fill:72 },
    { icon:'🦠', name:'WBC Count',   value:'7,200', unit:'/µL', status:'normal',   fill:60 },
    { icon:'🔴', name:'Platelets',   value:'2.1L',  unit:'/µL', status:'normal',   fill:65 },
    { icon:'☀️', name:'Vitamin D',   value:'18',    unit:'ng/mL',status:'low',     fill:28 },
    { icon:'🔩', name:'Iron (Serum)',value:'55',    unit:'µg/dL',status:'low',     fill:35 },
    { icon:'🍬', name:'Glucose (F)', value:'92',    unit:'mg/dL',status:'normal',  fill:58 },
    { icon:'🫀', name:'Cholesterol', value:'198',   unit:'mg/dL',status:'normal',  fill:62 },
    { icon:'🧪', name:'Creatinine',  value:'0.9',   unit:'mg/dL',status:'normal',  fill:55 },
  ];

  const sampleFindings = [
    { icon:'☀️', color:'fi-amber', title:'Low Vitamin D (18 ng/mL)', desc:'Below the normal range of 30–100 ng/mL. Vitamin D deficiency can cause fatigue, bone weakness, and low immunity. Consider supplementation and more sunlight exposure.', tag:'Monitor', tagStyle:'background:#fff8e1;color:#e65100;' },
    { icon:'🔩', color:'fi-blue',  title:'Low Serum Iron (55 µg/dL)', desc:'Slightly below the normal range of 60–170 µg/dL. Mild iron deficiency can cause tiredness. Including iron-rich foods like spinach, lentils and red meat may help.', tag:'Dietary', tagStyle:'background:#e3f2fd;color:#1565c0;' },
    { icon:'✅', color:'fi-green', title:'CBC Within Normal Range', desc:'Haemoglobin, WBC, and Platelet counts are all within healthy limits. No signs of anaemia or infection detected.', tag:'Normal', tagStyle:'background:#e8f5e9;color:#2e7d32;' },
  ];

  const sampleRecs = [
    { icon:'🌞', color:'rc-amber', title:'Vitamin D Supplement', desc:'Take 2000 IU daily with a meal. Re-test after 3 months to monitor levels. Also get 15–20 min of morning sunlight.' },
    { icon:'🥬', color:'rc-green', title:'Iron-Rich Diet', desc:'Include spinach, lentils, pumpkin seeds, and red meat. Pair with Vitamin C (lemon juice) to boost iron absorption.' },
    { icon:'💧', color:'rc-blue',  title:'Stay Hydrated', desc:'Drink at least 8 glasses of water daily. Good hydration supports kidney function and overall blood health.' },
    { icon:'🏃', color:'rc-rose',  title:'Light Exercise', desc:'30 minutes of walking or yoga 5 days a week improves Vitamin D synthesis and overall metabolic health.' },
  ];

  const sampleSteps = [
    { num:1, title:'Show this report to your doctor', desc:'Share the summary and flagged values with your GP or physician at your next visit.' },
    { num:2, title:'Start Vitamin D supplementation', desc:'Available over-the-counter. Take with a fatty meal for best absorption.' },
    { num:3, title:'Retest in 3 months', desc:'Follow up with a Vitamin D and Iron panel in 3 months to track improvement.' },
    { num:4, title:'Log this report in your health journal', desc:'Keep a record in MediMate to track trends over time.' },
  ];

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
    if (file) startAnalysis(file.name);
  }
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) startAnalysis(file.name);
  }

  /* ── ANALYSIS FLOW ── */
  function startAnalysis(filename) {
    // hide upload zone
    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('results').style.display = 'none';

    // show progress
    const pw = document.getElementById('progress-wrap');
    pw.classList.add('visible');
    document.getElementById('progress-filename').textContent = filename;

    const steps = ['step-upload','step-read','step-ai','step-done'];
    const msgs  = ['Uploading your file...','Reading document contents...','Running AI analysis...','Finalising results...'];
    let pct = 0; let stepIdx = 0;

    const scanMsgs = ['Reading your report...','Identifying test parameters...','Cross-referencing normal ranges...','Generating health summary...'];
    let scanIdx = 0;

    const interval = setInterval(() => {
      pct += 2;
      document.getElementById('progress-bar').style.width = pct + '%';
      document.getElementById('progress-pct').textContent = pct + '%';

      const newStepIdx = Math.floor(pct / 26);
      if (newStepIdx !== stepIdx && newStepIdx < steps.length) {
        if (stepIdx < steps.length) document.getElementById(steps[stepIdx]).classList.remove('active');
        stepIdx = newStepIdx;
        document.getElementById(steps[stepIdx]).classList.add('active');
      }
      if (pct > 25) document.getElementById('step-upload').classList.add('done');
      if (pct > 50) document.getElementById('step-read').classList.add('done');
      if (pct > 75) document.getElementById('step-ai').classList.add('done');

      // rotate scan text
      if (pct % 20 === 0 && scanIdx < scanMsgs.length) {
        document.getElementById('scan-text').textContent = scanMsgs[scanIdx++];
      }

      if (pct >= 100) {
        clearInterval(interval);
        document.getElementById('step-done').classList.add('done');
        setTimeout(() => {
          pw.classList.remove('visible');
          document.getElementById('scan-anim').classList.remove('active');
          showResults(filename);
        }, 600);
      }
    }, 40);

    
    setTimeout(() => {
      document.getElementById('scan-anim').classList.add('active');
    }, 400);
  }

  
  function showResults(filename) {
    document.getElementById('results-meta').textContent =
      'Analysed just now · ' + filename;

    // metrics
    const mg = document.getElementById('metrics-grid');
    mg.innerHTML = '';
    sampleMetrics.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'metric-card';
      card.style.animationDelay = (i*0.07)+'s';
      card.innerHTML = `
        <div class="metric-icon">${m.icon}</div>
        <div class="metric-name">${m.name}</div>
        <div class="metric-value">${m.value} <span class="metric-unit">${m.unit}</span></div>
        <span class="metric-status status-${m.status}">${m.status.charAt(0).toUpperCase()+m.status.slice(1)}</span>
        <div class="metric-bar"><div class="metric-bar-fill fill-${m.status}" id="mbar-${i}"></div></div>
      `;
      mg.appendChild(card);
    });

    // findings
    const fl = document.getElementById('findings-list');
    fl.innerHTML = '';
    sampleFindings.forEach((f, i) => {
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
    sampleRecs.forEach(r => {
      const card = document.createElement('div');
      card.className = `rec-card ${r.color}`;
      card.innerHTML = `<div class="rec-icon">${r.icon}</div><div class="rec-title">${r.title}</div><p class="rec-desc">${r.desc}</p>`;
      rg.appendChild(card);
    });

    // next steps
    const sl = document.getElementById('step-list');
    sl.innerHTML = '';
    sampleSteps.forEach(s => {
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
      sampleMetrics.forEach((m, i) => {
        const bar = document.getElementById('mbar-'+i);
        if (bar) bar.style.width = m.fill + '%';
      });
    }, 300);

    // animate findings in staggered
    setTimeout(() => {
      document.querySelectorAll('.finding-item').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 200);

    // health score count-up
    let n = 0;
    const target = 78;
    const scoreEl = document.getElementById('health-score-num');
    const scoreTimer = setInterval(() => {
      n = Math.min(n + 2, target);
      scoreEl.textContent = n;
      if (n >= target) clearInterval(scoreTimer);
    }, 25);

    showToast('✅ Report analysed successfully!');
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    navigator.clipboard.writeText(text).catch(() => {});
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
uploadZone.addEventListener("dragleave", () => {});

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
  console.log("File selected:", file.name);
}

const logoclick = document.querySelector(".logo-brand");

console.log(logoclick); // should NOT be null

logoclick.addEventListener("click", () => {
  console.log("clicked"); // check this in console
  window.location.href = "/frontend/pages/dashboard/index.html";
});


