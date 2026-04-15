// dots
let dots = [];
const MAX_DOTS = 18;
let mouse = { x: 0, y: 0 };
let lastPos = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const dx = mouse.x - lastPos.x;
    const dy = mouse.y - lastPos.y;
    if (Math.sqrt(dx*dx + dy*dy) < 20) return;
    lastPos = { ...mouse };

    const dot = document.createElement('div');
    dot.className = 'dot';
    const size = Math.random() * 8 + 5;
    dot.style.cssText = `width:${size}px;height:${size}px;left:${mouse.x - size/2}px;top:${mouse.y - size/2}px;opacity:0.7;transition:opacity 0.8s,transform 0.8s;`;
    document.body.appendChild(dot);
    dots.push(dot);

    requestAnimationFrame(() => {
        dot.style.opacity = '0';
        dot.style.transform = `translateY(${-20 - Math.random()*20}px) scale(0.3)`;
    });

    setTimeout(() => {
        dot.remove();
        dots = dots.filter(d => d !== dot);
    }, 900);

    if (dots.length > MAX_DOTS) {
        dots[0].remove();
        dots.shift();
    }
});

// button eventlistners

const buttons = document.querySelectorAll('.buttons');

const signInButton = document.querySelector('#signIn');

if(signInButton){
    signInButton.addEventListener('click' , ()=>{
         window.location.href = "../SignIn/index.html";
    });
}


const signUpButton = document.querySelector('#signUp');
if(signUpButton){
    signUpButton.addEventListener('click' , ()=>{
         window.location.href = "../SignUp/index.html";
    });
}


buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Save original text
        const originalText = this.innerText;
        
        // Change state
        this.innerText = "Loading...";
        this.style.width = "180px"; // Grow slightly
        
        // Simulate a delay (e.g., waiting for server)
        setTimeout(() => {
            this.innerText = originalText;
            this.style.width = "150px";
            alert(`${originalText} functionality coming soon!`);
        }, 1500);
    });
});





document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    // This moves the entire background container slightly
    const bg = document.getElementById('bg');
    bg.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Trigger the Toast after 3 seconds
setTimeout(() => {
    document.getElementById('toast').classList.add('show');
}, 3000);

// Simple counter animation for stats
const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const speed = 200; 
        const inc = target / speed;

        if (count < target) {
            counter.innerText = (count + inc).toFixed(target % 1 === 0 ? 0 : 1);
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target;
        }
    };
    updateCount();
});

const magneticButtons = document.querySelectorAll('.buttons');

magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        // Calculate distance from center of button to mouse
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move the button slightly toward the mouse (parallax effect)
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px) scale(1.05)`;
    });

    btn.addEventListener('mouseleave', () => {
        // Snap back to original position
        btn.style.transform = `translate(0px, 0px) scale(1)`;
    });
});

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Find all steps inside the section and animate them
            const steps = entry.target.querySelectorAll('.step');
            steps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('visible');
                }, index * 200); // Delays each step for a 'staggered' look
            });
        }
    });
}, observerOptions);

const howSection = document.querySelector('.how-section');
if (howSection) {
    observer.observe(howSection);
}
const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.5 });

const ctaBox = document.querySelector('.cta-box');
if (ctaBox) {
    ctaObserver.observe(ctaBox);
}

const buttonwhite = document.querySelector('.btn-white'); 
if(buttonwhite){
       buttonwhite.addEventListener('click' , ()=>{
         window.location.href = "../SignUp/index.html";
    });
}