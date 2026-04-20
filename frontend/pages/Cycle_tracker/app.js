const AVG_CYCLE   = 28;
const AVG_PERIOD  = 5;
const FERTILE_BEFORE_OVULATION = 5;
const OVULATION_DAY = 14;

let viewDate = new Date();
let cycles   = [];  


function getToken() {
  return localStorage.getItem('token');
}

async function loadCycles() {
  try {
    const res = await fetch('/api/cycles', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to load');
    cycles = await res.json();
  } catch (err) {
    console.error('Could not load cycles:', err);
    cycles = [];
  }
}


async function saveCycle(start, end) {
  try {
    const res = await fetch('/api/cycles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ start, end: end || null })
    });
    if (!res.ok) throw new Error('Failed to save');
    const saved = await res.json();
    cycles.push(saved); 
  } catch (err) {
    console.error('Could not save cycle:', err);
    showToast('Error saving. Please try again.');
  }
}


async function deleteCycleById(id) {
  try {
    const res = await fetch(`/api/cycles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to delete');
    cycles = cycles.filter(c => c._id !== id);  // remove from local array
  } catch (err) {
    console.error('Could not delete cycle:', err);
    showToast('Error deleting. Please try again.');
  }
}


savePeriodBtn.addEventListener('click', async () => {
  const start = startDateInput.value;
  const end   = endDateInput.value;

  if (!start) { showToast('Please enter a start date.'); return; }
  if (end && end < start) { showToast('End date must be after start date.'); return; }

  await saveCycle(start, end);   // saves to DB
  logCard.classList.remove('visible');
  refresh();
  showToast('Period logged successfully! 🌿');
});



btn.addEventListener('click', async () => {
  const id = btn.dataset.id;        
  await deleteCycleById(id);
  refresh();
  showToast('Period entry removed.');
});

// ── Update the history list to use _id ────────
// In updateHistory(), change the delete button's data attribute from:
//   data-idx="${cycles.indexOf(cycle)}"
// to:
//   data-id="${cycle._id}"

// ── Update Init ───────────────────────────────
// Replace the bottom `refresh()` call with this async init:
async function init() {
  await loadCycles();   // fetch from DB first
  refresh();            // then render everything
}

init();