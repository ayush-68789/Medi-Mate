/* ── GREETING based on time ── */
    const userStr = localStorage.getItem('user');
    let firstName = 'User';
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            firstName = user.username.split(' ')[0];
            const usernameEl = document.getElementById('username');
            if (usernameEl) usernameEl.textContent = firstName;
        } catch (e) {
            console.error("Error parsing user from localStorage", e);
        }
    }

    const hour = new Date().getHours();
    const greetWord = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const greetingEl = document.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = greetWord + ', ' + firstName + ' 👋';

    const dateOpts = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateLineEl = document.getElementById('date-line');
    if (dateLineEl) {
        dateLineEl.textContent =
          "Here's your health summary for " + new Date().toLocaleDateString('en-IN', dateOpts);
    }

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

    /* ── NUTRIENT GUIDE LOGIC ── */
    const nutrients = [
      { name: "Vitamin A", icon: "🥕", benefit: "Essential for good vision, immunity, and healthy skin.", sources: ["Carrots", "Sweet Potatoes", "Spinach", "Kale", "Beef Liver"] },
      { name: "Vitamin C", icon: "🍊", benefit: "Strong antioxidant, boosts immunity and helps collagen production.", sources: ["Oranges", "Bell Peppers", "Strawberries", "Broccoli", "Kiwi"] },
      { name: "Iron", icon: "🥩", benefit: "Vital for oxygen transport in blood and maintaining energy levels.", sources: ["Red Meat", "Spinach", "Lentils", "Pumpkin Seeds", "Quinoa"] },
      { name: "Calcium", icon: "🥛", benefit: "Critical for strong bones, healthy teeth, and muscle function.", sources: ["Milk", "Yogurt", "Fortified Tofu", "Sardines", "Almonds"] },
      { name: "Magnesium", icon: "🥜", benefit: "Supports muscle and nerve function, and improves sleep quality.", sources: ["Almonds", "Bananas", "Dark Chocolate", "Avocado", "Cashews"] },
      { name: "Vitamin D", icon: "☀️", benefit: "Helps calcium absorption and supports immune and bone health.", sources: ["Salmon", "Egg Yolks", "Mushrooms", "Fortified Milk", "Sunshine"] },
      { name: "Fiber", icon: "🌾", benefit: "Essential for digestive health and maintaining steady blood sugar.", sources: ["Oats", "Beans", "Apples", "Chia Seeds", "Whole Grains"] }
    ];

    let selectedNutrient = nutrients[0];

    function updateNutrientChip() {
      // Pick a nutrient based on the day of the year (consistent daily)
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      selectedNutrient = nutrients[dayOfYear % nutrients.length];
      
      const iconEl = document.getElementById('nutrient-icon');
      const nameEl = document.getElementById('nutrient-name');
      
      if (iconEl) iconEl.innerText = selectedNutrient.icon;
      if (nameEl) nameEl.innerText = selectedNutrient.name;
    }

    function openNutrientModal() {
      document.getElementById('modal-nutrient-icon').innerText = selectedNutrient.icon;
      document.getElementById('modal-nutrient-name').innerText = selectedNutrient.name;
      document.getElementById('modal-nutrient-benefit').innerText = selectedNutrient.benefit;
      
      const sourcesList = document.getElementById('modal-nutrient-sources');
      sourcesList.innerHTML = '';
      selectedNutrient.sources.forEach(source => {
        const span = document.createElement('span');
        span.className = 'mood-tag';
        span.style.cursor = 'default';
        span.innerText = source;
        sourcesList.appendChild(span);
      });
      
      openModal('nutrient-modal');
    }
    

    /* ── AI HEALTH QUOTE LOGIC ── */
    const healthQuotes = [
      "Health is a state of complete harmony of the body, mind and spirit.",
      "A healthy outside starts from the inside.",
      "Your body is your most priceless possession. Take care of it.",
      "Early to bed and early to rise makes a man healthy, wealthy and wise.",
      "Good health is not something we can buy. However, it can be an valuable savings account.",
      "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.",
      "Happiness is the highest form of health.",
      "The first wealth is health. - Ralph Waldo Emerson",
      "He who has health has hope; and he who has hope, has everything."
    ];

    function updateHealthQuote() {
      const quoteEl = document.getElementById('health-quote');
      if (!quoteEl) return;

      // Start fade out
      quoteEl.style.opacity = 0;

      setTimeout(() => {
        // Pick a truly random quote
        const quoteIdx = Math.floor(Math.random() * healthQuotes.length);
        quoteEl.innerText = `"${healthQuotes[quoteIdx]}"`;
        // Start fade in
        quoteEl.style.opacity = 1;
      }, 500); // Wait for fade out (0.5s) to complete
    }

    /* ── DAILY WELLNESS GOAL LOGIC ── */
    const dailyGoals = [
      { title: "Brisk Walk", icon: "👟", description: "Take a 15-minute brisk walk today. It boosts cardiovascular health and clears your mind." },
      { title: "Deep Breathing", icon: "🧘", description: "Practice 5 minutes of deep breathing to lower stress and improve lung capacity." },
      { title: "Hydration Focus", icon: "💧", description: "Drink a glass of water every 2 hours today to maintain peak cellular function." },
      { title: "Fruit Portion", icon: "🍎", description: "Eat at least two different fruits today to get a variety of vitamins and fiber." },
      { title: "Postural Break", icon: "🪑", description: "Every hour, stand up and stretch for 1 minute to reverse the effects of sitting." },
      { title: "Mindful Eating", icon: "🥗", description: "Eat one meal today without any screens. Focus entirely on the flavor and texture of your food." },
      { title: "No Sugar", icon: "🚫", description: "Try to avoid all added sugars today. Your energy levels will be more stable!" }
    ];

    let selectedGoal = dailyGoals[0];

    function updateDailyGoal() {
      // Pick a goal based on the day of the year
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
      selectedGoal = dailyGoals[dayOfYear % dailyGoals.length];
      
      const iconEl = document.getElementById('goal-icon');
      const textEl = document.getElementById('goal-text');
      
      if (iconEl) iconEl.innerText = selectedGoal.icon;
      if (textEl) textEl.innerText = selectedGoal.title;
    }

    function openGoalModal() {
      document.getElementById('modal-goal-icon').innerText = selectedGoal.icon;
      document.getElementById('modal-goal-title').innerText = selectedGoal.title;
      document.getElementById('modal-goal-description').innerText = selectedGoal.description;
      
      openModal('goal-modal');
    }

    /* ── PERSISTENCE ── */
    function saveDashboardData() {
      const today = new Date().toISOString().split("T")[0];
      const dashboardData = {
        lastSavedDate: today
      };
      localStorage.setItem("dashboard_v2", JSON.stringify(dashboardData));
    }

    function loadDashboardData() {
      // Nothing specific to load for the new passive features currently
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
      updateHealthQuote(); // Initial random quote
      updateNutrientChip(); // Initial nutrient
      updateDailyGoal(); // Initial goal
      setInterval(updateHealthQuote, 10000); // Rotate every 10 seconds
      
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