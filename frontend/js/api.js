//model
// api.js
// Responsible for all backend communication
const BASE_URL = "http://localhost:3000";

export async function getTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`);

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  const data = await res.json();
  return data;
}
