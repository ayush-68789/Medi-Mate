const AVG_CYCLE   = 28;   // days
const AVG_PERIOD  = 5;    // days
const FERTILE_BEFORE_OVULATION = 5;
const OVULATION_DAY = 14; // days before next period

let viewDate = new Date();
let cycles   = [];

const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('username').textContent = storedUser.name || 'User';


document.getElementById('profile-trigger').addEventListener('click', function() {
  document.getElementById('logout-menu').classList.toggle('show');
});

document.getElementById('logout-link').addEventListener('click', function() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../login/index.html';
});


function getToken() {
  return localStorage.getItem('token');
}


async function loadCycles() {
  try {
    const res = await fetch('http://localhost:3000/api/cycles', {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    cycles = await res.json();
  } catch (err) {
    console.error('Could not load cycles:', err);
    cycles = [];
  }
}


async function saveCycle(start, end) {
  try {
        console.log("TOKEN:", getToken());
    const res = await fetch('http://localhost:3000/api/cycles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify({ start: start, end: end || null })
    });
        if (!res.ok) {
      throw new Error('Failed to save');
    }
    const saved = await res.json();
    cycles.push(saved);
    return true;
  } catch (err) {
    console.error('Could not save cycle:', err);
    showToast('Error saving. Please try again.');
    return false;
  }
}

// ── Delete a cycle ────────────────────────────
async function deleteCycleById(id) {
  try {
    await fetch('http://localhost:3000/api/cycles/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    cycles = cycles.filter(function(c) { return c._id !== id; });
  } catch (err) {
    console.error('Could not delete cycle:', err);
    showToast('Error deleting. Please try again.');
  }
}


function toISO(date) {
  return date.toISOString().split('T')[0];
}

function parseDate(str) {
  const parts = str.split('-');
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function diffDays(a, b) {
  return Math.round((b - a) / 86400000);
}

function formatShort(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function monthName(date) {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}


function getLastCycle() {
  if (!cycles.length) return null;
  return cycles.slice().sort(function(a, b) {
    return b.start.localeCompare(a.start);
  })[0];
}


function getNextPeriodDate() {
  const last = getLastCycle();
  if (!last) return null;
  return addDays(parseDate(last.start), AVG_CYCLE);
}


function getActualPeriodDates() {
  const dates = new Set();
  cycles.forEach(function(cycle) {
    const s = parseDate(cycle.start);
    const e = cycle.end ? parseDate(cycle.end) : addDays(s, AVG_PERIOD - 1);
    let cur = new Date(s);
    while (cur <= e) {
      dates.add(toISO(cur));
      cur = addDays(cur, 1);
    }
  });
  return dates;
}


function updateSummary() {
  const last = getLastCycle();

  if (!last) {
    document.getElementById('currentPhase').textContent = 'Unknown';
    document.getElementById('dayOfCycle').textContent   = '—';
  } else {
    const today     = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = parseDate(last.start);
    const endDate   = last.end ? parseDate(last.end) : addDays(startDate, AVG_PERIOD - 1);
    const dayNum    = diffDays(startDate, today) + 1;

    let phase = 'Luteal';
    if (today >= startDate && today <= endDate) phase = 'Menstruation';
    else if (dayNum <= 13) phase = 'Follicular';
    else if (dayNum === 14) phase = 'Ovulation';

    document.getElementById('currentPhase').textContent = phase;
    document.getElementById('dayOfCycle').textContent   = dayNum > 0 ? 'Day ' + dayNum + ' of cycle' : '—';
  }

  // Next period
  const nextDate = getNextPeriodDate();
  if (nextDate) {
    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAway = diffDays(today, nextDate);
    document.getElementById('nextPeriodVal').textContent  = formatShort(nextDate);
    document.getElementById('nextPeriodDays').textContent = daysAway >= 0
      ? daysAway + ' days away'
      : 'Overdue';
  } else {
    document.getElementById('nextPeriodVal').textContent  = '—';
    document.getElementById('nextPeriodDays').textContent = 'Log a period first';
  }

  // Cycle length & period duration averages
  if (cycles.length >= 2) {
    const sorted = cycles.slice().sort(function(a, b) { return a.start.localeCompare(b.start); });
    let totalCycle = 0, totalDur = 0;

    for (let i = 1; i < sorted.length; i++) {
      totalCycle += diffDays(parseDate(sorted[i-1].start), parseDate(sorted[i].start));
    }
    sorted.forEach(function(c) {
      const s = parseDate(c.start);
      const e = c.end ? parseDate(c.end) : addDays(s, AVG_PERIOD - 1);
      totalDur += diffDays(s, e) + 1;
    });

    const avgC = Math.round(totalCycle / (sorted.length - 1));
    const avgD = Math.round(totalDur / sorted.length);
    document.getElementById('cycleLength').innerHTML   = avgC + ' <span>days</span>';
    document.getElementById('periodDuration').innerHTML = avgD + ' <span>days</span>';
  }
}

// ── Update predictions panel ──────────────────
function updatePredictions() {
  const list     = document.getElementById('predictionList');
  list.innerHTML = '';

  const nextDate = getNextPeriodDate();
  if (!nextDate) {
    list.innerHTML = '<p style="font-size:0.85rem;color:var(--text-muted)">Log your first period to see predictions.</p>';
    return;
  }

  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  const daysAway = diffDays(today, nextDate);

  const ovulation    = addDays(nextDate, -OVULATION_DAY);
  const fertileStart = addDays(ovulation, -FERTILE_BEFORE_OVULATION);
  const fertileEnd   = addDays(ovulation, 1);

  const items = [
    {
      icon: '🩸', iconClass: 'period-icon',
      label: 'Next Period',
      date:  formatShort(nextDate) + ' — ' + formatShort(addDays(nextDate, AVG_PERIOD - 1)),
      badge: daysAway >= 0 ? 'in ' + daysAway + 'd' : 'Overdue'
    },
    {
      icon: '🌸', iconClass: 'fertile-icon',
      label: 'Fertile Window',
      date:  formatShort(fertileStart) + ' — ' + formatShort(fertileEnd),
      badge: 'Est.'
    }
  ];

  items.forEach(function(item) {
    const el = document.createElement('div');
    el.className = 'pred-item';
    el.innerHTML =
      '<div class="pred-icon ' + item.iconClass + '">' + item.icon + '</div>' +
      '<div class="pred-info">' +
        '<p class="pred-label">' + item.label + '</p>' +
        '<p class="pred-date">'  + item.date  + '</p>' +
      '</div>' +
      '<span class="pred-badge">' + item.badge + '</span>';
    list.appendChild(el);
  });
}

// ── Update period history list ────────────────
function updateHistory() {
  const historyList  = document.getElementById('historyList');
  const historyEmpty = document.getElementById('historyEmpty');
  historyList.innerHTML = '';

  const sorted = cycles.slice().sort(function(a, b) { return b.start.localeCompare(a.start); });

  if (!sorted.length) {
    historyEmpty.style.display = 'block';
    return;
  }
  historyEmpty.style.display = 'none';

  sorted.forEach(function(cycle) {
    const s   = parseDate(cycle.start);
    const e   = cycle.end ? parseDate(cycle.end) : addDays(s, AVG_PERIOD - 1);
    const dur = diffDays(s, e) + 1;

    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML =
      '<div class="history-dates">' +
        '<strong>' + formatShort(s) + '</strong> → ' + formatShort(e) +
      '</div>' +
      '<span class="history-duration">' + dur + 'd</span>' +
      '<button class="history-del" data-id="' + cycle._id + '" title="Delete">×</button>';
    historyList.appendChild(li);
  });

  // Delete buttons
  historyList.querySelectorAll('.history-del').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      await deleteCycleById(btn.dataset.id);
      refresh();
      showToast('Period entry removed.');
    });
  });
}

// ── Build the calendar ────────────────────────
function buildCalendar() {
  document.getElementById('calMonthLabel').textContent = monthName(viewDate);

  const calGrid     = document.getElementById('calGrid');
  calGrid.innerHTML = '';

  const year        = viewDate.getFullYear();
  const month       = viewDate.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const actualDates = getActualPeriodDates();
  const nextDate    = getNextPeriodDate();

  // Predicted period dates
  const predictedDates = new Set();
  if (nextDate) {
    for (let i = 0; i < AVG_PERIOD; i++) {
      predictedDates.add(toISO(addDays(nextDate, i)));
    }
  }

  // Fertile window dates
  const fertileDates = new Set();
  if (nextDate) {
    const ovulation = addDays(nextDate, -14);
    for (let i = -5; i <= 1; i++) {
      fertileDates.add(toISO(addDays(ovulation, i)));
    }
  }

  // Empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day empty';
    calGrid.appendChild(blank);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(year, month, d);
    const dateISO = toISO(date);
    const div     = document.createElement('div');

    let classes = 'cal-day';
    if (date.getTime() === today.getTime()) classes += ' today';
    if (actualDates.has(dateISO))           classes += ' period';
    else if (predictedDates.has(dateISO))   classes += ' predicted';
    else if (fertileDates.has(dateISO))     classes += ' fertile';

    div.className   = classes;
    div.textContent = d;
    calGrid.appendChild(div);
  }
}

// ── Log Period form ───────────────────────────
document.getElementById('logBtn').addEventListener('click', function() {
  const logCard = document.getElementById('logCard');
  logCard.classList.toggle('visible');
  if (logCard.classList.contains('visible')) {
    document.getElementById('startDate').value = toISO(new Date());
    document.getElementById('endDate').value   = toISO(addDays(new Date(), AVG_PERIOD - 1));
  }
});

document.getElementById('cancelLog').addEventListener('click', function() {
  document.getElementById('logCard').classList.remove('visible');
});

document.getElementById('savePeriod').addEventListener('click', async function() {
  const start = document.getElementById('startDate').value;
  const end   = document.getElementById('endDate').value;

  if (!start) { showToast('Please enter a start date.'); return; }
  if (end && end < start) { showToast('End date must be after start date.'); return; }

  const btn       = document.getElementById('savePeriod');
  btn.disabled    = true;
  btn.textContent = 'Saving…';

  const ok = await saveCycle(start, end);

  btn.disabled    = false;
  btn.textContent = 'Save';

  if (ok) {
    document.getElementById('logCard').classList.remove('visible');
    refresh();
    showToast('Period logged! 🌿');
  }
});

// ── Calendar navigation ───────────────────────
document.getElementById('prevMonth').addEventListener('click', function() {
  viewDate.setMonth(viewDate.getMonth() - 1);
  buildCalendar();
});

document.getElementById('nextMonth').addEventListener('click', function() {
  viewDate.setMonth(viewDate.getMonth() + 1);
  buildCalendar();
});

// ── Toast notification ────────────────────────
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// ── Refresh everything ────────────────────────
function refresh() {
  updateSummary();
  updatePredictions();
  updateHistory();
  buildCalendar();
}

// ── Start the app ─────────────────────────────
async function init() {
  await loadCycles();
  refresh();
}

init();