const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");

const BASE_URL =
  localStorage.getItem("API_BASE_URL") || "http://127.0.0.1:3000";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const username = document.getElementById("username").value.trim();

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Login failed");

    const token = data.accessToken || data.token || data.access_token;
    if (!token) throw new Error("No token returned by server");

    localStorage.setItem("token", token);
    window.location.href = "index.html";
  } catch (err) {
    errorEl.textContent = err.message || "Failed to fetch";
  }
});
