// Check for data in sessionStorage
const analysisData = JSON.parse(sessionStorage.getItem('latestAnalysis'));

if (!analysisData) {
    window.location.href = '../symptom-analyzer/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    populateReport(analysisData);
    setupInitialAnimations();
});

function populateReport(data) {
    // Risk Meter Logic
    const riskValue = document.getElementById('risk-value');
    const meterFill = document.getElementById('meter-fill');
    const riskLevel = data.risk_level.toLowerCase();
    
    riskValue.textContent = data.risk_level;
    riskValue.className = `risk-value risk-${riskLevel}`;
    
    let dashOffset = 283; // Circumference
    if (riskLevel === 'low') dashOffset = 200;
    if (riskLevel === 'moderate') dashOffset = 140;
    if (riskLevel === 'high') dashOffset = 40;
    
    setTimeout(() => {
        meterFill.style.strokeDashoffset = dashOffset;
        meterFill.classList.add(`meter-${riskLevel}`);
    }, 300);

    // Lists
    fillList('advisory-list', data.advisory);
    fillList('precautions-list', data.precautions);
    fillList('tests-list', data.suggested_tests);
    
    // Text
    document.getElementById('next-steps-text').textContent = data.next_steps;
    document.getElementById('disclaimer-text').textContent = data.disclaimer;
    
    // Summary Info
    document.getElementById('summary-symptoms').textContent = data.input_symptoms || 'Multiple Symptoms';
    document.getElementById('summary-severity').textContent = `${data.input_severity}/10`;
    document.getElementById('summary-duration').textContent = data.input_duration;
    
    const sevPill = document.getElementById('severity-indicator');
    if (data.input_severity <= 3) {
        sevPill.textContent = 'Low';
        sevPill.className = 'severity-pill sev-low';
    } else if (data.input_severity <= 7) {
        sevPill.textContent = 'Moderate';
        sevPill.className = 'severity-pill sev-moderate';
    } else {
        sevPill.textContent = 'High';
        sevPill.className = 'severity-pill sev-high';
    }
}

function fillList(id, items) {
    const el = document.getElementById(id);
    el.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.animationDelay = `${index * 0.1}s`;
        li.textContent = item;
        el.appendChild(li);
    });
}

function setupInitialAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 100);
    });
}

// Navigation
document.getElementById('logo-home').addEventListener('click', () => {
    window.location.href = '../dashboard/index.html';
});

document.getElementById('back-to-dashboard').addEventListener('click', () => {
    window.location.href = '../dashboard/index.html';
});

document.getElementById('new-analysis-btn').addEventListener('click', () => {
    sessionStorage.removeItem('latestAnalysis');
    window.location.href = '../symptom-analyzer/index.html';
});
