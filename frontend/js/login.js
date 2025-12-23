import { login, register } from "./api.js";

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");

// Inputs
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");

// Buttons
const signupBtn = document.getElementById("signupBtn");

function setError(msg) {
  errorEl.textContent = msg || "";
}

async function doAuth(mode) {
  setError("");

  const username = (usernameEl.value || "").trim();
  const password = passwordEl.value || "";

  if (!username) return setError("Username is required");
  if (!password || password.length < 6) return setError("Password must be at least 6 characters");

  try {
    const result =
      mode === "signup"
        ? await register(username, password)
        : await login(username, password);

    // backend returns: { success: true, data: { token, user: {...} } }
    const token = result?.data?.token;
    if (!token) throw new Error("No token returned by server");

    localStorage.setItem("token", token);

    // optional: keep user info for UI later
    if (result?.data?.user) {
      localStorage.setItem("user", JSON.stringify(result.data.user));
      // Redirect admin to admin.html, regular users to index.html
      if (result.data.user.role === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      window.location.href = "index.html";
    }
  } catch (err) {
    setError(err.message || "Failed to fetch");
  }
}

// Login by default on form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await doAuth("login");
});

// Signup button click
if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await doAuth("signup");
  });
}
