const BASE_URL =
  localStorage.getItem("API_BASE_URL") || "http://127.0.0.1:3000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ---- Tasks (protected) ----
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: { ...authHeader() },
  });
  return parseJson(res);
}

export async function createTask(payload) {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  return parseJson(res);
}

// ---- Auth (public) ----
export async function register(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseJson(res);
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseJson(res);
}

// ---- Admin Users (protected) ----
export async function getAdminUsers() {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { ...authHeader() },
  });
  return parseJson(res);
}

export async function createAdminUser(payload) {
  const res = await fetch(`${BASE_URL}/api/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function updateAdminUser(id, payload) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteAdminUser(id) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  return parseJson(res);
}

// ---- Admin Tasks (protected) ----
export async function getAdminAllTasks() {
  const res = await fetch(`${BASE_URL}/api/admin/tasks`, {
    headers: { ...authHeader() },
  });
  return parseJson(res);
}

export async function getAdminTasksForUser(userId) {
  const res = await fetch(`${BASE_URL}/api/admin/tasks?userId=${userId}`, {
    headers: { ...authHeader() },
  });
  return parseJson(res);
}

export async function updateAdminTask(id, payload) {
  const res = await fetch(`${BASE_URL}/api/admin/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteAdminTask(id) {
  const res = await fetch(`${BASE_URL}/api/admin/tasks/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  return parseJson(res);
}
