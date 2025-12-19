const BASE_URL = "http://192.168.28.158:3000";

async function parseJson(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function getTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`);
  return parseJson(res);
}

export async function createTask(payload) {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
  });
  return parseJson(res);
}
