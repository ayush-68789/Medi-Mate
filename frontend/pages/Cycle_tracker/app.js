/* ─────────────────────────────────────────────
   Medi-Mate — Cycle Tracker  |  app.js
   ───────────────────────────────────────────── */

// ── State ────────────────────────────────────
const STORAGE_KEY = 'mediMate_cycles';
const AVG_CYCLE   = 28;   // days
const AVG_PERIOD  = 5;    // days
const FERTILE_BEFORE_OVULATION = 5;
const OVULATION_DAY = 14; // days before next period

let viewDate   = new Date();          // currently displayed month
let cycles     = loadCycles();        // [{start, end}]

// ── DOM refs ─────────────────────────────────
const calGrid         = document.getElementById('calGrid');
const calMonthLabel   = document.getElementById('calMonthLabel');
const logCard         = document.getElementById('logCard');
const logBtn          = document.getElementById('logBtn');
const savePeriodBtn   = document.getElementById('savePeriod');
const cancelLogBtn    = document.getElementById('cancelLog');
const startDateInput  = document.getElementById('startDate');
const endDateInput    = document.getElementById('endDate');
const historyList     = document.getElementById('historyList');
const historyEmpty    = document.getElementById('historyEmpty');
const predictionList  = document.getElementById('predictionList');
const toast           = document.getElementById('toast');

// summary cards
const currentPhaseEl  = document.getElementById('currentPhase');
const dayOfCycleEl    = document.getElementById('dayOfCycle');
const nextPeriodVal   = document.getElementById('nextPeriodVal');
const nextPeriodDays  = document.getElementById('nextPeriodDays');
const cycleLengthEl   = document.getElementById('cycleLength');
const periodDurEl     = document.getElementById('periodDuration');

// ── Helpers ───────────────────────────────────
function toISO(date) {
  return date.toISOString().split('T')[0];
}

function parseDate(str) {
  // Parse as local date to avoid timezone off-by-one
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function diffDays(a, b) {
  return Math.round((b - a) / 86400000);
}

function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatShort(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function monthName(date) {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

function loadCycles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveCycles() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cycles));
}

// ── Calculations ──────────────────────────────
function getLastCycle() {
  if (!cycles.length) return null;
  return cycles.slice().sort((a, b) => b.start.localeCompare(a.start))[0];
}

function getNextPeriodDate() {
  const last = getLastCycle();
  if (!last) return null;
  return addDays(parseDate(last.start), AVG_CYCLE);
}

function getFertileWindow(nextPeriodDate) {
  // Ovulation ~ 14 days before next period
  const ovulation = addDays(nextPeriodDate, -OVULATION_DAY);
  return {
    start: addDays(ovulation, -FERTILE_BEFORE_OVULATION),
    end:   addDays(ovulation, 1)
  };
}

function getPredictedPeriodDates(nextPeriodDate) {
  // Returns set of ISO strings for predicted period days
  const dates = new Set();
  for (let i = 0; i < AVG_PERIOD; i++) {
    dates.add(toISO(addDays(nextPeriodDate, i)));
  }
  return dates;
}

function getActualPeriodDates() {
  const dates = new Set();
  cycles.forEach(({ start, end }) => {
    const s = parseDate(start);
    const e = end ? parseDate(end) : addDays(s, AVG_PERIOD - 1);
    let cur = new Date(s);
    while (cur <= e) {
      dates.add(toISO(cur));
      cur = addDays(cur, 1);
    }
  });
  return dates;
}

function getCurrentPhase() {
  const last = getLastCycle();
  if (!last) return { phase: 'Unknown', day: null };

  const today     = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = parseDate(last.start);
  const endDate   = last.end ? parseDate(last.end) : addDays(startDate, AVG_PERIOD - 1);
  const nextPeriod = getNextPeriodDate();
  const fertile    = getFertileWindow(nextPeriod);

  const dayNum = diffDays(startDate, today) + 1;

  let phase;
  if (today >= startDate && today <= endDate) {
    phase = 'Menstruation';
  } else if (today >= addDays(endDate, 1) && today < fertile.start) {
    phase = 'Follicular';
  } else if (today >= fertile.start && today <= fertile.end) {
    phase = 'Ovulation';
  } else {
    phase = 'Luteal';
  }

  return { phase, day: dayNum > 0 ? dayNum : null };
}

// ── Summary Cards ─────────────────────────────
function updateSummary() {
  const { phase, day } = getCurrentPhase();
  currentPhaseEl.textContent = phase;
  dayOfCycleEl.textContent   = day ? `Day ${day} of cycle` : '—';

  const nextDate = getNextPeriodDate();
  if (nextDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAway = diffDays(today, nextDate);
    nextPeriodVal.textContent  = formatShort(nextDate);
    nextPeriodDays.textContent = daysAway >= 0
      ? `${daysAway} day${daysAway !== 1 ? 's' : ''} away`
      : 'Overdue';
  } else {
    nextPeriodVal.textContent  = '—';
    nextPeriodDays.textContent = 'Log a period first';
  }

  // Avg cycle & duration from logged data
  if (cycles.length >= 2) {
    const sorted = cycles.slice().sort((a, b) => a.start.localeCompare(b.start));
    let totalCycle = 0, totalDur = 0;
    for (let i = 1; i < sorted.length; i++) {
      totalCycle += diffDays(parseDate(sorted[i-1].start), parseDate(sorted[i].start));
    }
    sorted.forEach(c => {
      const s = parseDate(c.start);
      const e = c.end ? parseDate(c.end) : addDays(s, AVG_PERIOD - 1);
      totalDur += diffDays(s, e) + 1;
    });
    const avgC = Math.round(totalCycle / (sorted.length - 1));
    const avgD = Math.round(totalDur / sorted.length);
    cycleLengthEl.innerHTML = `${avgC} <span>days</span>`;
    periodDurEl.innerHTML   = `${avgD} <span>days</span>`;
  }
}

// ── Predictions Panel ─────────────────────────
function updatePredictions() {
  predictionList.innerHTML = '';
  const nextDate = getNextPeriodDate();

  if (!nextDate) {
    predictionList.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted)">Log your first period to see predictions.</p>';
    return;
  }

  const fertile = getFertileWindow(nextDate);
  const today   = new Date();
  today.setHours(0, 0, 0, 0);
  const daysAway = diffDays(today, nextDate);

  const items = [
    {
      icon: '🩸',
      iconClass: 'period-icon',
      label: 'Next Period',
      date: `${formatShort(nextDate)} — ${formatShort(addDays(nextDate, AVG_PERIOD - 1))}`,
      badge: daysAway >= 0 ? `in ${daysAway}d` : 'Overdue'
    },
    {
      icon: '🌸',
      iconClass: 'fertile-icon',
      label: 'Fertile Window',
      date: `${formatShort(fertile.start)} — ${formatShort(fertile.end)}`,
      badge: 'Est.'
    }
  ];

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'pred-item';
    el.innerHTML = `
      <div class="pred-icon ${item.iconClass}">${item.icon}</div>
      <div class="pred-info">
        <p class="pred-label">${item.label}</p>
        <p class="pred-date">${item.date}</p>
      </div>
      <span class="pred-badge">${item.badge}</span>
    `;
    predictionList.appendChild(el);
  });
}

// ── History ───────────────────────────────────
function updateHistory() {
  historyList.innerHTML = '';
  const sorted = cycles.slice().sort((a, b) => b.start.localeCompare(a.start));

  if (!sorted.length) {
    historyEmpty.style.display = 'block';
    return;
  }
  historyEmpty.style.display = 'none';

  sorted.forEach((cycle, idx) => {
    const s   = parseDate(cycle.start);
    const e   = cycle.end ? parseDate(cycle.end) : addDays(s, AVG_PERIOD - 1);
    const dur = diffDays(s, e) + 1;

    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <div class="history-dates">
        <strong>${formatShort(s)}</strong> → ${formatShort(e)}
      </div>
      <span class="history-duration">${dur}d</span>
      <button class="history-del" data-idx="${cycles.indexOf(cycle)}" title="Delete">×</button>
    `;
    historyList.appendChild(li);
  });

  // Delete buttons
  historyList.querySelectorAll('.history-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      cycles.splice(i, 1);
      saveCycles();
      refresh();
      showToast('Period entry removed.');
    });
  });
}

// ── Calendar ──────────────────────────────────
function buildCalendar() {
  calMonthLabel.textContent = monthName(viewDate);
  calGrid.innerHTML = '';

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const actualDates    = getActualPeriodDates();
  const nextDate       = getNextPeriodDate();
  const predictedDates = nextDate ? getPredictedPeriodDates(nextDate) : new Set();
  const fertile        = nextDate ? getFertileWindow(nextDate) : null;

  // Blank cells for days before month start
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day empty';
    calGrid.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(year, month, d);
    const dateISO = toISO(date);
    const div     = document.createElement('div');

    let classes = 'cal-day';

    if (date.getTime() === today.getTime()) classes += ' today';

    if (actualDates.has(dateISO)) {
      classes += ' period';
    } else if (predictedDates.has(dateISO)) {
      classes += ' predicted';
    } else if (fertile && date >= fertile.start && date <= fertile.end) {
      classes += ' fertile';
    }

    div.className   = classes;
    div.textContent = d;

    // Tooltip on hover
    div.title = dateISO;

    calGrid.appendChild(div);
  }
}

// ── Log Form ──────────────────────────────────
logBtn.addEventListener('click', () => {
  logCard.classList.toggle('visible');
  if (logCard.classList.contains('visible')) {
    // Default: today
    startDateInput.value = toISO(new Date());
    endDateInput.value   = toISO(addDays(new Date(), AVG_PERIOD - 1));
    startDateInput.focus();
  }
});

cancelLogBtn.addEventListener('click', () => {
  logCard.classList.remove('visible');
});

savePeriodBtn.addEventListener('click', () => {
  const start = startDateInput.value;
  const end   = endDateInput.value;

  if (!start) { showToast('Please enter a start date.'); return; }
  if (end && end < start) { showToast('End date must be after start date.'); return; }

  cycles.push({ start, end: end || null });
  saveCycles();
  logCard.classList.remove('visible');
  refresh();
  showToast('Period logged successfully! 🌿');
});

// ── Navigation ────────────────────────────────
document.getElementById('prevMonth').addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth() - 1);
  buildCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  viewDate.setMonth(viewDate.getMonth() + 1);
  buildCalendar();
});

// ── Toast ─────────────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Refresh all ──────────────────────────────
function refresh() {
  updateSummary();
  updatePredictions();
  updateHistory();
  buildCalendar();
}

// ── Profile Initialization ───────────────────
function initProfile() {
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
}

// ── Init ─────────────────────────────────────
refresh();
initProfile();

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

/* ── PARTICLES (Bubbles) ── */
const pContainer = document.getElementById('particles');
if (pContainer) {
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 60 + Math.random() * 120;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random()*100}%;
            animation-duration:${10 + Math.random() * 18}s;
            animation-delay:${Math.random() * 10}s;
        `;
        pContainer.appendChild(p);
    }
}