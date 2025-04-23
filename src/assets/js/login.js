document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const icon = togglePassword.querySelector("i");
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("username");
  const errorMsg = document.getElementById("error-message");

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });

  // Login form submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "admin" && password === "keycab2025") {
      errorMsg.classList.add("hidden");
      window.location.href = "registration.html";
    } else {
      errorMsg.classList.remove("hidden");
    }
  });
});
