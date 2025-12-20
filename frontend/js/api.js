const BASE_URL = "http://192.168.28.158:3000";

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function getTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    headers: {
      ...authHeader(),
    },
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
    headers: {
      ...authHeader(),
    },
  });
  return parseJson(res);
}
