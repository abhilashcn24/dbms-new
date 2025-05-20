const API_BASE_URL = 'http://localhost:3000/api/users';

document.getElementById('authForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const mode = currentMode; // 'signup' or 'login'
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const name = document.getElementById('name')?.value.trim();
  const panNumber = document.getElementById('pan')?.value.toUpperCase();
  const aadhaarNumber = document.getElementById('aadhar')?.value;
  const error = document.getElementById('errorMsg');

  function validateEmail(email) {
    return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email);
  }

  function validatePAN(pan) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
  }

  function validateAadhaar(aadhar) {
    return /^\d{12}$/.test(aadhar);
  }

  if (!validateEmail(email)) {
    error.textContent = 'Invalid email format';
    return;
  }

  if (mode === 'signup') {
    if (!name) {
      error.textContent = 'Name is required';
      return;
    }
    if (!validatePAN(panNumber)) {
      error.textContent = 'PAN must be 10 characters (e.g., ABCDE1234F)';
      return;
    }
    if (!validateAadhaar(aadhaarNumber)) {
      error.textContent = 'Aadhaar must be 12 digits';
      return;
    }
  }

  try {
    let payload = { email, password };

    if (mode === 'signup') {
      payload = {
        ...payload,
        name,
        phone: '', // optional
        role: 'investor',
        panNumber,
        aadhaarNumber,
      };
    }

    const response = await fetch(`${API_BASE_URL}/${mode === 'signup' ? 'register' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      error.textContent = data.message || 'Something went wrong';
      return;
    }

    error.textContent = '';

    // Store token and redirect
    localStorage.setItem('token', data);
    alert(`${mode === 'signup' ? 'Signup' : 'Login'} successful! Welcome, ${data.user.name}`);
    window.location.href = '/frontend/home.html'; // Change to your homepage or dashboard

  } catch (err) {
    console.error('Auth Error:', err);
    error.textContent = 'Network error. Please try again.';
  }
});

// Aadhaar digit-only enforcement
document.getElementById('aadhar')?.addEventListener('keypress', function (e) {
  if (!/\d/.test(e.key)) e.preventDefault();
});
