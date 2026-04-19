/* ── GREETING based on time ── */
    const hour = new Date().getHours();
    const greetWord = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greeting').textContent = greetWord + ', Rahul 👋';
    const dateOpts = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('date-line').textContent =
      "Here's your health summary for " + new Date().toLocaleDateString('en-IN', dateOpts);

    /* ── LOGO CHAIN ── */
    const icons  = ['🩺','📋','🩸','💊','🧬','❤️','🫀','🧪','💉','🌡️','🩹'];
    const labels = ['Symptoms','Reports','Cycle','Meds','Genetics','Heart','Vitals','Lab','X-Ray','Vaccine','Temp','Wounds'];
    const chain  = document.getElementById('chain');

    const pages = {
        '🩺': 'features/stethoscope/index.html',
        '📋': 'features/reports/index.html',
        '🩸': 'features/blood/index.html',
        '💊': 'features/med/index.html',
        '🧬': 'features/dna/index.html',
        '❤️': 'features/heart/index.html',
        '🫀': 'features/heart/index.html',   // same page (you said both hearts same)
        '🧪': 'features/chemical/index.html',
        '💉': 'features/injection/index.html',
        '🌡️': 'features/temperature/index.html',
        '🩹': 'features/bandaid/index.html'
    };
    for (let i = 0; i < 25; i++) {
        const idx = i % icons.length;
        const icon = icons[idx];

        const el = document.createElement('div');
        el.className = 'logo-bubble';

        el.style.animationDelay = (i * 0.14) + 's';

        el.innerHTML = icon + '<span class="tooltip">' + labels[idx] + '</span>';

        el.addEventListener("click", () => {
            el.style.transform = "scale(1.3)";
            setTimeout(() => {
            if (pages[icon]) {
                window.location.href = pages[icon];
            }
            }, 150);
        });

        chain.appendChild(el);   // ✅ only once
}



    /* ── STEP COUNTER roll-up ── */
    const target = 7842;
    let count = 0;
    const stepEl = document.getElementById('steps-count');
    const timer = setInterval(() => {
      count = Math.min(count + 280, target);
      stepEl.textContent = count.toLocaleString('en-IN');
      if (count >= target) clearInterval(timer);
    }, 35);

    /* ── HEALTH SCORE ring animate ── */
    const ring = document.getElementById('ring');
    const circ = 2 * Math.PI * 14;
    setTimeout(() => {
      ring.style.strokeDasharray = (circ * 0.82).toFixed(1) + ' ' + circ.toFixed(1);
    }, 400);

    /* ── STAT CHIP TIPS ── */
    const tips = {
      steps: { icon: '👟', msg: '<strong>7,842 steps</strong> — you\'re 78% to your 10,000 step goal. A brisk 12-min walk will get you there!' },
      water: { icon: '💧', msg: '<strong>6/8 glasses done.</strong> Try to drink 2 more glasses before 8 PM for optimal hydration.' },
      meds:  { icon: '💊', msg: '<strong>Vitamin D</strong> is still pending. Best taken with your evening meal for better absorption.' },
      cycle: { icon: '🌙', msg: '<strong>Day 14 — Ovulation window.</strong> Energy peaks now. Great day for exercise and high-focus tasks!' }
    };

    let tipTimeout;
    function showTip(key) {
      clearTimeout(tipTimeout);
      const t   = tips[key];
      const area = document.getElementById('tip-area');
      area.innerHTML =
        '<div class="quick-tip">'
        + '<span class="tip-icon">' + t.icon + '</span>'
        + '<span class="tip-text">'  + t.msg  + '</span>'
        + '</div>';
      tipTimeout = setTimeout(() => { area.innerHTML = ''; }, 5000);
    }

    /* ── GENERAL MODAL LOGIC ── */
    function openModal(id) {
      document.getElementById(id).style.display = "flex";
    }

    function closeModal(id) {
      document.getElementById(id).style.display = "none";
    }

    /* ── WATER TRACKER LOGIC ── */
    let waterGlasses = 0;
    const waterTarget = 8;

    function openWaterModal() {
      document.getElementById('modal-water-count').innerText = waterGlasses;
      openModal('water-modal');
    }

    function updateWater(change) {
      waterGlasses = Math.max(0, waterGlasses + change);
      document.getElementById('modal-water-count').innerText = waterGlasses;
      
      // Update Chip UI
      document.getElementById('water-count').innerText = `${waterGlasses}/${waterTarget}`;
      
      const trend = document.getElementById('water-trend');
      if (waterGlasses >= waterTarget) {
        trend.innerText = "✓ Goal reached";
        trend.className = "stat-trend up";
      } else if (waterGlasses >= 5) {
        trend.innerText = "↑ On track";
        trend.className = "stat-trend up";
      } else {
        trend.innerText = "⏳ Keep drinking";
        trend.className = "stat-trend neutral";
      }

      saveDashboardData();
    }

    /* ── MEDICATION TRACKER LOGIC ── */
    let medications = [];
    let activeReminder = null;

    function openMedsModal() {
      const list = document.getElementById('meds-list');
      list.innerHTML = medications.length === 0 ? '<p style="text-align:center; color:#999; padding:20px;">No medications added yet.</p>' : "";
      
      medications.forEach(med => {
        const item = document.createElement('div');
        item.className = `med-item ${med.taken ? 'checked' : ''}`;
        item.innerHTML = `
          <div class="med-info">
            <input type="checkbox" ${med.taken ? 'checked' : ''} onchange="toggleMed(${med.id})">
            <div>
                <span>${med.name}</span>
                <span class="med-time">⏰ ${formatTime(med.time)}</span>
            </div>
          </div>
          <button class="btn-delete" onclick="deleteMedication(${med.id})">×</button>
        `;
        list.appendChild(item);
      });
      openModal('meds-modal');
    }

    function addNewMedication() {
        const nameInput = document.getElementById('new-med-name');
        const timeInput = document.getElementById('new-med-time');
        
        if (!nameInput.value || !timeInput.value) {
            alert("Please provide both name and time.");
            return;
        }

        const newMed = {
            id: Date.now(),
            name: nameInput.value,
            time: timeInput.value,
            taken: false,
            lastNotified: "" // To prevent multiple notifications in the same minute
        };

        medications.push(newMed);
        nameInput.value = "";
        timeInput.value = "";
        
        openMedsModal();
        updateMedsChip();
        saveDashboardData();
    }

    function deleteMedication(id) {
        medications = medications.filter(m => m.id !== id);
        openMedsModal();
        updateMedsChip();
        saveDashboardData();
    }

    function toggleMed(id) {
      const med = medications.find(m => m.id === id);
      if (med) {
        med.taken = !med.taken;
        openMedsModal(); 
        updateMedsChip();
        saveDashboardData();
      }
    }

    function updateMedsChip() {
      const takenCount = medications.filter(m => m.taken).length;
      const totalCount = medications.length;
      document.getElementById('meds-count').innerText = `${takenCount}/${totalCount}`;
      
      const trend = document.getElementById('meds-trend');
      if (totalCount === 0) {
        trend.innerText = "No meds scheduled";
        trend.className = "stat-trend neutral";
        return;
      }

      const pending = totalCount - takenCount;
      if (pending === 0) {
        trend.innerText = "✓ All taken";
        trend.className = "stat-trend up";
      } else {
        trend.innerText = `⏳ ${pending} pending`;
        trend.className = "stat-trend neutral";
      }
    }

    function formatTime(time24) {
        const [h, m] = time24.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    }

    /* ── REMINDER ENGINE ── */
    function startReminderEngine() {
        setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const today = now.toISOString().split('T')[0];

            medications.forEach(med => {
                if (!med.taken && med.time === currentTime && med.lastNotified !== today) {
                    showReminder(med);
                    med.lastNotified = today;
                    saveDashboardData();
                }
            });
        }, 30000); // Check every 30 seconds
    }

    function showReminder(med) {
        activeReminder = med;
        document.getElementById('reminder-text').innerText = `It's time for your ${med.name}!`;
        document.getElementById('reminder-overlay').style.display = "block";
        
        // Play subtle sound if possible or just visual
    }

    function closeReminder() {
        document.getElementById('reminder-overlay').style.display = "none";
        activeReminder = null;
    }

    function markAsTakenFromReminder() {
        if (activeReminder) {
            toggleMed(activeReminder.id);
            closeReminder();
        }
    }

    /* ── CYCLE TRACKER LOGIC ── */
    let lastPeriodStart = "";

    function openCycleModal() {
      if (lastPeriodStart) {
        document.getElementById('cycle-date-input').value = lastPeriodStart;
        updateCycleDetails();
      }
      openModal('cycle-modal');
    }

    function setCycleDate(date) {
      lastPeriodStart = date;
      updateCycleDetails();
      updateCycleChip();
      saveDashboardData();
    }

    function updateCycleDetails() {
      const details = document.getElementById('cycle-info-details');
      if (!lastPeriodStart) {
        details.innerHTML = "Select a start date to see cycle insights.";
        return;
      }

      const start = new Date(lastPeriodStart);
      const today = new Date();
      const diffTime = Math.abs(today - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const cycleDay = (diffDays % 28) || 28;
      let phase = "";
      let advice = "";

      if (cycleDay <= 5) {
        phase = "Menstrual Phase";
        advice = "Focus on rest and warm, iron-rich foods. Gentle stretching is recommended.";
      } else if (cycleDay <= 13) {
        phase = "Follicular Phase";
        advice = "Energy levels are rising. Great time for high-intensity workouts and social planning.";
      } else if (cycleDay <= 16) {
        phase = "Ovulation Window";
        advice = "Highest fertility window. You might feel more social and vibrant today!";
      } else {
        phase = "Luteal Phase";
        advice = "Self-care is key. Focus on magnesium-rich foods and getting enough sleep.";
      }

      details.innerHTML = `
        <p><strong>Day ${cycleDay}</strong> — ${phase}</p>
        <p style="margin-top: 8px; font-style: italic;">"${advice}"</p>
      `;
    }

    function updateCycleChip() {
      if (!lastPeriodStart) return;
      
      const start = new Date(lastPeriodStart);
      const today = new Date();
      const diffTime = Math.abs(today - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const cycleDay = (diffDays % 28) || 28;

      document.getElementById('cycle-count').innerText = `Day ${cycleDay}`;
      const trend = document.getElementById('cycle-trend');
      
      if (cycleDay <= 5) trend.innerText = "Menstrual phase";
      else if (cycleDay <= 13) trend.innerText = "Follicular phase";
      else if (cycleDay <= 16) trend.innerText = "Ovulation window";
      else trend.innerText = "Luteal phase";
    }

    /* ── PERSISTENCE ── */
    function saveDashboardData() {
      const today = new Date().toISOString().split("T")[0];
      const dashboardData = {
        water: waterGlasses,
        meds: medications,
        cycleDate: lastPeriodStart,
        lastSavedDate: today
      };
      localStorage.setItem("dashboard_v2", JSON.stringify(dashboardData));
    }

    function loadDashboardData() {
      const today = new Date().toISOString().split("T")[0];
      const saved = localStorage.getItem("dashboard_v2");
      if (saved) {
        const data = JSON.parse(saved);
        
        // Reset "taken" status if it's a new day
        if (data.lastSavedDate !== today) {
            data.meds.forEach(m => m.taken = false);
            waterGlasses = 0; // Reset water too for new day
        } else {
            waterGlasses = data.water || 0;
        }

        medications = data.meds || [];
        lastPeriodStart = data.cycleDate || "";
        
        // Update UIs
        document.getElementById('water-count').innerText = `${waterGlasses}/${waterTarget}`;
        updateMedsChip();
        updateCycleChip();
        if (lastPeriodStart) {
            const input = document.getElementById('cycle-date-input');
            if (input) input.value = lastPeriodStart;
        }
      }
    }

    /* ── MOOD TRACKER LOGIC ── */
    let selectedMood = "";

    const moodMap = {
      happy:   { emoji: "😄", text: "Feeling happy" },
      calm:    { emoji: "🙂", text: "Feeling calm" },
      neutral: { emoji: "😐", text: "Feeling neutral" },
      sad:     { emoji: "😔", text: "Feeling sad" },
      angry:   { emoji: "😡", text: "Feeling angry" }
    };

    function openMoodModal() {
      openModal('mood-modal');
    }

    function selectMood(mood, el) {
      selectedMood = mood;
      
      // Visual feedback
      document.querySelectorAll(".emoji-row span").forEach(e => {
        e.style.transform = "scale(1)";
        e.style.opacity = "0.5";
      });
      el.style.transform = "scale(1.4)";
      el.style.opacity = "1";

      const today = new Date().toISOString().split("T")[0];
      const moodData = { mood: selectedMood, date: today };
      localStorage.setItem("mood-" + today, JSON.stringify(moodData));
      
      // Update UI
      document.getElementById("mood-emoji").innerText = moodMap[selectedMood].emoji;
      document.getElementById("mood-text").innerText = moodMap[selectedMood].text;

      setTimeout(() => closeModal('mood-modal'), 300);
    }

    // Load saved mood & other data
    window.addEventListener('load', () => {
      loadDashboardData();
      startReminderEngine();
      
      const today = new Date().toISOString().split("T")[0];
      const savedMood = localStorage.getItem("mood-" + today);
      if (savedMood) {
        const data = JSON.parse(savedMood);
        if (moodMap[data.mood]) {
          document.getElementById("mood-emoji").innerText = moodMap[data.mood].emoji;
          document.getElementById("mood-text").innerText = moodMap[data.mood].text;
        }
      }

      // ── TRIGGER ENTRY ANIMATIONS ──
      const sections = ['.wave-bar', '.hero', '.stats-row', '.cards-section'];
      sections.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.classList.add('reveal');
      });
    });

    const uploadBtn = document.getElementById("Uploadbtn");
    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        // Redirect to report analyzer (placeholder for now as the page doesn't exist)
        window.location.href = "/frontend/pages/reportAnalyzer/index.html";
      });
    }