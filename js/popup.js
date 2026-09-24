function getStorage(key) {
  try { return localStorage.getItem(key); } catch(e) { return null; }
}
function setStorage(key, val) {
  try { localStorage.setItem(key, val); } catch(e) {}
}

// POPUP AUTO OPEN — only if not already submitted
if (!getStorage('vaagn_popup_submitted')) {
  setTimeout(() => {
    const overlay = document.getElementById('popup-overlay');
    if (overlay) openPopup('General');
  }, 15000);
}
function openPopup(v) {
  document.getElementById('p-vehicle').value = v;
  document.getElementById('popup-sub').textContent = v !== 'General' 
    ? 'Enquiring about ' + v + '. Our team calls back within 24h.' 
    : 'Our team will call you back within 24 hours.';
  document.getElementById('popup-overlay').classList.add('active');
}

function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
}
document.getElementById('popup-overlay').addEventListener('click', e => { 
  if(e.target === e.currentTarget) closePopup(); 
});

let popupSubmitting = false;

async function submitPopup() {
  if (popupSubmitting) return;

  const name = document.getElementById('p-name').value.trim();
  const phone = document.getElementById('p-phone').value.trim();
  const city = document.getElementById('p-city').value.trim();
  const vehicle = document.getElementById('p-vehicle').value;
  if(!name || phone.length < 10) {
    const err = document.getElementById('p-error');
    if(err) { err.textContent = 'Please enter your name and a 10-digit phone number.'; err.style.display = 'block'; }
    return;
  }

  // Honeypot check — bots fill hidden fields
  const honeypot = document.getElementById('p-honeypot');
  if(honeypot && honeypot.value) return;

  popupSubmitting = true;
  const btn = document.querySelector('.p-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  const p = new URLSearchParams({ 
    name, phone: '+91' + phone, city, vehicle, 
   source: document.referrer ? new URL(document.referrer).hostname : 'Direct',
    timestamp: new Date().toISOString() 
  });
  
  try { 
    await fetch('https://script.google.com/macros/s/AKfycbwzxRKP8thz4Rjj1cEckPWc2HyWR4qw_3HfaxkHNF31IVHrbPonCHZpVhTYWqpctmgm/exec?' + p.toString()); 
  } catch(e) {}
  
  btn.textContent = '✓ Sent!';
  const err = document.getElementById('p-error');
  if(err) err.style.display = 'none';
  setStorage('vaagn_popup_submitted', '1');
  setTimeout(() => {
    closePopup();
    btn.textContent = 'Request Callback →';
    btn.disabled = false;
    popupSubmitting = false;
    ['p-name', 'p-phone', 'p-city'].forEach(id => document.getElementById(id).value = '');
  }, 1800);
}