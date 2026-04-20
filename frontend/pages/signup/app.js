const API_URL = 'http://localhost:3000/api/auth';

// ANIMATION FIX
window.addEventListener('load', () => {
  const card = document.querySelector('.signin-card');
  if (card) card.classList.add('reveal');
});

// FORM SUBMIT HANDLER
document.getElementById('signUpForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const msg = document.getElementById('msg');

  // Password validation
  if (password !== confirmPassword) {
    msg.style.color = 'red';
    msg.textContent = 'Passwords do not match!';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      msg.style.color = 'green';
      msg.textContent = 'Registered! Redirecting...';

      setTimeout(() => {

        window.location.href = '../dashboard/index.html';
      }, 1500);

    } else {
      msg.style.color = 'red';
      msg.textContent = data.message || 'Registration failed!';
    }

  } catch (err) {
    console.error(err);
    msg.style.color = 'red';
    msg.textContent = 'Server error. Is backend running?';
  }
});