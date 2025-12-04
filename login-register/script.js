function showRegister() {
  resetForms(); // limpia los campos
  document.getElementById("loginForm").style.display = "none"
  document.getElementById("registerForm").style.display = "flex"
}

function showLogin() {
  resetForms(); // limpia los campos
  document.getElementById("loginForm").style.display = "flex"
  document.getElementById("registerForm").style.display = "none"
}

function togglePasswordVisibility(id) {
  const passwordInput = document.getElementById(id);
  const passwordToggle = passwordInput.nextElementSibling; 

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    passwordToggle.classList.remove("fa-eye");
    passwordToggle.classList.add("fa-eye-slash");
  } else {
    passwordInput.type = "password";
    passwordToggle.classList.remove("fa-eye-slash");
    passwordToggle.classList.add("fa-eye");
  }
}
function resetForms() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => input.value = '');
}

function handleLogin() {
  resetForms(); // limpia los campos del login
}

function validateForm() {
  const registerBtn = document.getElementById("registerBtn");

  registerBtn.classList.add("success");

  // Termina la animacion y redirige al home.
  setTimeout(() => {
    registerBtn.classList.remove("success");
    window.location.href = "../home/home.html";
  }, 1200);
}