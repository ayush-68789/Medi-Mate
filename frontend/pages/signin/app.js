const signInModal = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openSignIn');
const closeBtn = document.getElementById('closeBtn');

// Open modal
if (openBtn) {
    openBtn.addEventListener('click', () => {
        signInModal.style.display = 'flex';
    });
}

// Close modal
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        window.location.href = "../home_page/index.html";
    });
}

// Close on background click
window.addEventListener('click', (e) => {
    if (e.target === signInModal) {
         window.location.href = "../home_page/index.html";
    }
});

// ── REDIRECTS TO DASHBOARD ──

const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = "../dashboard/index.html";
    });
}

const googleBtn = document.querySelector('.btn-google');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        window.location.href = "../dashboard/index.html";
    });
}

    // -- TRIGGER ENTRY ANIMATIONS --
    window.addEventListener('load', () => {
      const card = document.querySelector('.signin-card');
      if (card) card.classList.add('reveal');
    });
