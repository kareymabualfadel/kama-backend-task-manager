import { getTasks, createTask } from "./api.js";

const els = {
  taskList: document.getElementById("taskList"),
  taskForm: document.getElementById("taskForm"),
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  status: document.getElementById("status"),
  message: document.getElementById("message"),
};

function showMessage(text, isError = false) {
  els.message.hidden = false;
  els.message.textContent = text;
  els.message.style.borderColor = isError ? "#ff5a5a" : "#2b3040";
}

function hideMessage() {
  els.message.hidden = true;
  els.message.textContent = "";
}

function renderTasks(tasks) {
  els.taskList.innerHTML = "";

  if (!tasks || tasks.length === 0) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No tasks yet.";
    els.taskList.appendChild(li);
    return;
  }

  for (const task of tasks) {
    const li = document.createElement("li");
    li.textContent = `${task.title} (${task.status})`;
    els.taskList.appendChild(li);
  }
}

async function loadTasks() {
  try {
    const res = await getTasks();
    renderTasks(res.data);
  } catch (err) {
    renderTasks([]);
    console.error(err);
    showMessage("Failed to load tasks ❌", true);
  }
}

els.taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const payload = {
    title: els.title.value.trim(),
    description: els.description.value.trim(),
    status: els.status.value,
  };

  if (!payload.title) {
    showMessage("Title is required.", true);
    return;
  }

  try {
    await createTask(payload);
    showMessage("Task created ✅");
    els.title.value = "";
    els.description.value = "";
    els.status.value = "open";
    await loadTasks();
  } catch (err) {
    showMessage(`Create failed: ${err.message}`, true);
  }
});

// document.getElementById("refreshBtn").addEventListener("click", loadTasks);

loadTasks();
