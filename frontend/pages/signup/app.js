// const closeBtn = document.getElementById('closeBtn');
// const form = document.getElementById('signUpForm');

// // Close → go back to main page
// closeBtn.addEventListener('click', () => {
//     window.location.href = "../home_page/index.html";
// });

// // Password validation
// form.addEventListener('submit', (e) => {
//     const password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;

//     if (password !== confirmPassword) {
//         e.preventDefault();
//         alert("Passwords do not match!");
//     } else {
//         e.preventDefault(); // In a real app we'd submit to server, here we just redirect
//         window.location.href = "../dashboard/index.html";
//     }
// });

// const googleBtn = document.querySelector('.btn-google');
// if (googleBtn) {
//     googleBtn.addEventListener('click', () => {
//         window.location.href = "../dashboard/index.html";
//     });
// }

//     // -- TRIGGER ENTRY ANIMATIONS --
//     window.addEventListener('load', () => {
//       const card = document.querySelector('.signin-card');
//       if (card) card.classList.add('reveal');
//     });


const API_URL = 'http://localhost:3000/api/auth';

    async function register() {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        document.getElementById('msg').style.color = 'green';
        document.getElementById('msg').textContent = 'Registered! Redirecting...';

        setTimeout(() => {
          window.location.href = 'dashboard.html'; // 👈 change to your page
        }, 1500);

      } else {
        document.getElementById('msg').style.color = 'red';
        document.getElementById('msg').textContent = data.message || 'Registration failed!';
      }
    }