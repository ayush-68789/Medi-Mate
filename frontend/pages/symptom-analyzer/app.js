document.getElementById('logo-home').addEventListener('click', () => {
    window.location.href = '../dashboard/index.html';
});

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = '../dashboard/index.html';
});

const chips = document.querySelectorAll('.chip:not(#other-chip)');
const otherChip = document.getElementById('other-chip');
const selectedCountEl = document.getElementById('selected-count');
const analyzeChipsBtn = document.getElementById('analyze-btn-chips');
const chipSection = document.getElementById('chip-section');
const textSection = document.getElementById('text-section');
const backToChipsBtn = document.getElementById('back-to-chips');
const leftSubtitle = document.getElementById('left-subtitle');

let selected = new Set();

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        const sym = chip.dataset.symptom;
        if (selected.has(sym)) {
            selected.delete(sym);
            chip.classList.remove('chip-active');
        } else {
            selected.add(sym);
            chip.classList.add('chip-active');
        }
        updateCount();
    });
});

function updateCount() {
    const n = selected.size;
    selectedCountEl.textContent = n === 0 ? '0 selected' : `${n} symptom${n > 1 ? 's' : ''} selected`;
    analyzeChipsBtn.disabled = n === 0;
    analyzeChipsBtn.style.opacity = n === 0 ? '0.5' : '1';
}

// ── Other chip → show textarea, hide chips ──
otherChip.addEventListener('click', () => {
    chipSection.classList.add('section-exit');
    setTimeout(() => {
        chipSection.classList.add('hidden');
        chipSection.classList.remove('section-exit');
        textSection.classList.remove('hidden');
        textSection.classList.add('section-enter');
        leftSubtitle.textContent = "Describe your symptoms in detail so our AI can accurately analyze your health situation and provide tailored guidance.";
        setTimeout(() => textSection.classList.remove('section-enter'), 500);
    }, 350);
});

// ── Back to chips from textarea ──
backToChipsBtn.addEventListener('click', () => {
    textSection.classList.add('section-exit');
    setTimeout(() => {
        textSection.classList.add('hidden');
        textSection.classList.remove('section-exit');
        chipSection.classList.remove('hidden');
        chipSection.classList.add('section-enter');
        leftSubtitle.textContent = "Select all the symptoms you're currently experiencing. Our AI will analyze them and provide tailored health guidance.";
        setTimeout(() => chipSection.classList.remove('section-enter'), 500);
    }, 350);
});

// ── Step Transitions ──
const detailsSection = document.getElementById('details-section');
const toDetailsBtnText = document.getElementById('to-details-btn-text');
const backToSymptomsBtn = document.getElementById('back-to-symptoms-btn');
const analyzeFinalBtn = document.getElementById('analyze-final-btn');

// From Chips to Details
analyzeChipsBtn.addEventListener('click', () => {
    if (selected.size === 0) return;
    transitionSection(chipSection, detailsSection, "Almost there! Tell us a bit more about how you're feeling to improve accuracy.");
});

// From Text to Details
toDetailsBtnText.addEventListener('click', () => {
    const input = document.getElementById('symptom-input').value.trim();
    if (!input) {
        document.getElementById('symptom-input').focus();
        return;
    }
    transitionSection(textSection, detailsSection, "Almost there! Tell us a bit more about how you're feeling to improve accuracy.");
});

// Back to symptoms from details
backToSymptomsBtn.addEventListener('click', () => {
    const isFromText = document.getElementById('symptom-input').value.trim() !== "";
    transitionSection(detailsSection, isFromText ? textSection : chipSection, "Select all the symptoms you're currently experiencing.");
});

function transitionSection(from, to, subtitle) {
    from.classList.add('section-exit');
    setTimeout(() => {
        from.classList.add('hidden');
        from.classList.remove('section-exit');
        to.classList.remove('hidden');
        to.classList.add('section-enter');
        leftSubtitle.textContent = subtitle;
        setTimeout(() => to.classList.remove('section-enter'), 500);
    }, 350);
}

// ── Details Handling ──
const severitySlider = document.getElementById('severity-slider');
const severityVal = document.getElementById('severity-val');
const severityLabel = document.getElementById('severity-label');

severitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    severityVal.textContent = val;
    if (val <= 3) {
        severityLabel.textContent = "Low";
        severityLabel.className = "severity-label label-low";
    } else if (val <= 7) {
        severityLabel.textContent = "Moderate";
        severityLabel.className = "severity-label label-moderate";
    } else {
        severityLabel.textContent = "High";
        severityLabel.className = "severity-label label-high";
    }
});

let selectedDuration = "1-3 days";
document.querySelectorAll('.duration-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.duration-chip').forEach(c => c.classList.remove('duration-active'));
        chip.classList.add('duration-active');
        selectedDuration = chip.dataset.val;
    });
});

// ── Final Analysis ──
analyzeFinalBtn.addEventListener('click', () => {
    const symptoms = selected.size > 0 ? [...selected].join(', ') : document.getElementById('symptom-input').value;
    runAnalysis(symptoms, severitySlider.value, selectedDuration);
});

const resultsSection = document.getElementById('results-section');
const newAnalysisBtn = document.getElementById('new-analysis-btn');

async function runAnalysis(symptoms, severity, duration) {
    analyzeFinalBtn.innerHTML = 'Analyzing... ⏳';
    analyzeFinalBtn.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms, severity, duration })
        });

        if (!response.ok) throw new Error('Failed to fetch analysis');

        const data = await response.json();
        
        // Store data including inputs for the results page
        sessionStorage.setItem('latestAnalysis', JSON.stringify({
            ...data,
            input_symptoms: symptoms,
            input_severity: severity,
            input_duration: duration
        }));

        // Redirect to results page
        window.location.href = '../symptom_result/index.html';

    } catch (error) {
        console.error('Error:', error);
        alert('Connection error. Please ensure the backend is running.');
        analyzeFinalBtn.innerHTML = 'Complete Analysis ✨';
        analyzeFinalBtn.disabled = false;
    }
}
