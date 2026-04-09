
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
        '🩺': 'sthescope.html',
        '📋': 'reports.html',
        '🩸': 'blood.html',
        '💊': 'med.html',
        '🧬': 'dna.html',
        '❤️': 'heart.html',
        '🫀': 'heart.html',   // same page (you said both hearts same)
        '🧪': 'chemical.html',
        '💉': 'injection.html',
        '🌡️': 'temperature.html',
        '🩹': 'bandaid.html'
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
    // const target = 7842;
    // let count = 0;
    // const stepEl = document.getElementById('steps-count');
    // const timer = setInterval(() => {
    //   count = Math.min(count + 280, target);
    //   stepEl.textContent = count.toLocaleString('en-IN');
    //   if (count >= target) clearInterval(timer);
    // }, 35);

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

    /* ── MOOD TRACKER LOGIC ── */
            /* ── MOOD TRACKER LOGIC (Instant Save) ── */
        let selectedMood = "";

        const moodMap = {
            happy:   { emoji: "😄", text: "Feeling happy" },
            calm:    { emoji: "🙂", text: "Feeling calm" },
            neutral: { emoji: "😐", text: "Feeling neutral" },
            sad:     { emoji: "😔", text: "Feeling sad" },
            angry:   { emoji: "😡", text: "Feeling angry" }
        };

        function openMoodModal() {
            document.getElementById("mood-modal").style.display = "flex";
        }

        function selectMood(mood, el) {
            // 1. Set the selection
            selectedMood = mood;
            
            // 2. Immediate Visual Feedback
            document.querySelectorAll(".emoji-row span").forEach(e => {
                e.style.transform = "scale(1)";
                e.style.opacity = "0.5";
            });
            el.style.transform = "scale(1.4)";
            el.style.opacity = "1";

            // 3. Trigger Save Logic Automatically (No Save button needed)
            const today = new Date().toISOString().split("T")[0];
            const moodData = {
                mood: selectedMood,
                date: today
            };

            localStorage.setItem("mood-" + today, JSON.stringify(moodData));
            
            // 4. Update Dashboard UI
            document.getElementById("mood-emoji").innerText = moodMap[selectedMood].emoji;
            document.getElementById("mood-text").innerText = moodMap[selectedMood].text;

            // 5. Close modal after a short delay so the user sees the click
            setTimeout(() => {
                closeMoodModal();
            }, 200);
        }

        function closeMoodModal() {
            document.getElementById("mood-modal").style.display = "none";
            
            // Reset selection for next time
            selectedMood = "";
            document.querySelectorAll(".emoji-row span").forEach(e => {
                e.style.transform = "scale(1)";
                e.style.opacity = "1";
            });
        }

        const upload = document.getElementById("Uploadbtn");
        upload.addEventListener("click", () => {
            window.location.href = "../reportAnalyzer/index.html";
        });