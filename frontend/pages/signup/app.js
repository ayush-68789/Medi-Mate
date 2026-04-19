const closeBtn = document.getElementById('closeBtn');
const form = document.getElementById('signUpForm');

// Close → go back to main page
closeBtn.addEventListener('click', () => {
    window.location.href = "../home_page/index.html";
});

// Password validation
form.addEventListener('submit', (e) => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        e.preventDefault();
        alert("Passwords do not match!");
    } else {
        e.preventDefault(); // In a real app we'd submit to server, here we just redirect
        window.location.href = "../dashboard/index.html";
    }
});

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
