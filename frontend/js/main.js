import { getTasks } from "./api.js";

const taskList = document.getElementById("taskList");

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (!tasks || tasks.length === 0) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No tasks yet.";
    taskList.appendChild(li);
    return;
  }

  for (const task of tasks) {
    const li = document.createElement("li");
    li.textContent = `${task.title} (${task.status})`;
    taskList.appendChild(li);
  }
}

async function loadTasks() {
  try {
    const res = await getTasks();
    renderTasks(res.data);
  } catch (err) {
    taskList.innerHTML = "";
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "Failed to load tasks ❌";
    taskList.appendChild(li);
    console.error(err);
  }
}

loadTasks();
