 const toast = document.getElementById('toast');
  function showToast(m) {
    toast.textContent = m;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }
 
  const h = new Date().getHours(), on = h >= 9 && h < 21;
  document.getElementById('sdot').style.background = on ? '#ECFFDC' : '#fde68a';
  document.getElementById('stext').textContent = on ? 'Online · replies in ~2 hrs' : 'Away · back in the morning';
 
  const er = document.getElementById('emailRow'), ch = document.getElementById('chint');
  er.addEventListener('mouseenter', () => ch.style.display = 'inline');
  er.addEventListener('mouseleave', () => ch.style.display = 'none');
  er.addEventListener('click', () =>
    navigator.clipboard.writeText('hello@medimate.ai')
      .then(() => showToast('Email copied!'))
      .catch(() => showToast('hello@medimate.ai'))
  );
 
//   document.getElementById('chatBtn').addEventListener('click', () => {
//     showToast('Connecting to live chat…');
//     setTimeout(() => showToast('An agent will be with you shortly!'), 2200);
//   });
 
  const mb = document.getElementById('modalBg');
//   document.getElementById('msgBtn').addEventListener('click', () => mb.classList.add('open'));
  document.getElementById('closeMod').addEventListener('click', () => mb.classList.remove('open'));
  document.getElementById('cancelMod').addEventListener('click', () => mb.classList.remove('open'));
 
  document.getElementById('doSend').addEventListener('click', () => {
    const n = document.getElementById('mname').value.trim();
    const e = document.getElementById('memail').value.trim();
    const b = document.getElementById('mbody').value.trim();
    if (!n || !e || !b) { showToast('Please fill in all fields.'); return; }
    mb.classList.remove('open');
    ['mname','memail','mbody'].forEach(id => document.getElementById(id).value = '');
    showToast("Message sent! We'll reply within 2 hours.");
  });


const goback = document.querySelector('#msgBtn'); 
if(goback){
       goback.addEventListener('click' , ()=>{
         window.location.href = "../FirstPage/index.html";
    });
}

console.log(goback);
console.log("js loaded");