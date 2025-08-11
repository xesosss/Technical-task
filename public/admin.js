// login Panel

const form = document.getElementById("login-form");
const requestStatus = document.querySelector(".result-box");

// Create function for show error or success

const showResult = (message, result) => {
  const label = document.createElement("label");
  label.textContent = `${result}: ${message}`;
  label.className = `${result}`;
  requestStatus.appendChild(label);
  setTimeout(() => {
    requestStatus.removeChild(label);
  }, 5000);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  // Create object from form data
  const formData = new FormData(form);
  const adminData = {};

  formData.forEach((value, key) => {
    adminData[key] = value;
  });

  // Send data from form for log in
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
    },
    body: JSON.stringify({
      username: adminData.username,
      password: adminData.password,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    window.location.href = "/main";
  } else {
    showResult(data.message, data.result);
  }
});
