const closeBtn = document.getElementById('closeBtn');
const form = document.getElementById('signUpForm');

// Close → go back to main page
closeBtn.addEventListener('click', () => {
    window.location.href = "../FirstPage/index.html";
});

// Password validation
form.addEventListener('submit', (e) => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        e.preventDefault();
        alert("Passwords do not match!");
    }
});