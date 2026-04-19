const API_URL = 'http://localhost:3000/api/auth';

// Close button
const closeBtn = document.getElementById('closeBtn');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        window.location.href = "../home_page/index.html";
    });
}

// Close on background click
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
        window.location.href = "../home_page/index.html";
    }
});

// Entry animation
window.addEventListener('load', () => {
    const card = document.querySelector('.signin-card');
    if (card) card.classList.add('reveal');
});

// Sign In Form Submit
const signInForm = document.getElementById('signInForm');
if (signInForm) {
    signInForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('si-email').value;
        const password = document.getElementById('si-password').value;
        const msg = document.getElementById('msg');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // ✅ Save user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                msg.style.color = 'green';
                msg.textContent = `Welcome back, ${data.user.username}! Redirecting...`;

                setTimeout(() => {
                    window.location.href = "../dashboard/index.html";
                }, 1500);

            } else {
                msg.style.color = 'red';
                msg.textContent = data.message || 'Login failed!';
            }

        } catch (err) {
            console.error(err);
            msg.style.color = 'red';
            msg.textContent = 'Server error. Is backend running?';
        }
    });
}

// Google button (placeholder)
const googleBtn = document.querySelector('.btn-google');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        alert('Google login coming soon!');
    });
}

