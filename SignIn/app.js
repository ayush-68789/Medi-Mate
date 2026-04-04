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
        window.location.href = "../FirstPage/index.html";
    });
}

// Close on background click
window.addEventListener('click', (e) => {
    if (e.target === signInModal) {
         window.location.href = "../FirstPage/index.html";
    }
});