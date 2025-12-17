const BASE_URL = "http://localhost:3000";

export async function getTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function createTask(payload) {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
