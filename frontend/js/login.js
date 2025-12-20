const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");




form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();

  try {
    const res = await fetch("http://192.168.28.158:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    localStorage.setItem("token", data.accessToken);
    window.location.href = "index.html";
  } catch (err) {
    errorEl.textContent = err.message;
  }
});
