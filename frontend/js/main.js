// // ---------------------------------controller


// // UI Skeleton only (no API yet)

// const taskList = document.getElementById("taskList");

// function renderPlaceholder() {
//   taskList.innerHTML = "";
//   const li = document.createElement("li");
//   li.className = "muted";
//   li.textContent = "UI ready ✅ Backend not connected yet.";
//   taskList.appendChild(li);
// }

// renderPlaceholder();


// UI-only phase (no backend yet)
// We simulate a database with an in-memory array

const els = {
  formTitle: document.getElementById("formTitle"),
  taskForm: document.getElementById("taskForm"),
  taskId: document.getElementById("taskId"),
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  status: document.getElementById("status"),
  cancelBtn: document.getElementById("cancelBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  taskList: document.getElementById("taskList"),
  template: document.getElementById("taskItemTemplate"),
  message: document.getElementById("message"),
};

// ----- Fake DB -----
let tasks = [
  {
    id: "1",
    title: "Learn Express",
    description: "Understand routing and middleware",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Build CRUD API",
    description: "GET/POST/PUT/DELETE",
    status: "done",
    createdAt: new Date().toISOString(),
  },
];

// ----- Helpers -----
function showMessage(text, isError = false) {
  els.message.hidden = false;
  els.message.textContent = text;
  els.message.style.borderColor = isError ? "#ff5a5a" : "#2b3040";
}

function hideMessage() {
  els.message.hidden = true;
  els.message.textContent = "";
}

function setFormModeCreate() {
  els.formTitle.textContent = "Create Task";
  els.taskId.value = "";
  els.title.value = "";
  els.description.value = "";
  els.status.value = "open";
  els.cancelBtn.hidden = true;
}

function setFormModeEdit(task) {
  els.formTitle.textContent = "Edit Task";
  els.taskId.value = task.id;
  els.title.value = task.title;
  els.description.value = task.description || "";
  els.status.value = task.status || "open";
  els.cancelBtn.hidden = false;
}

function getFormData() {
  return {
    id: els.taskId.value.trim(),
    title: els.title.value.trim(),
    description: els.description.value.trim(),
    status: els.status.value,
  };
}

function renderTasks(list) {
  els.taskList.innerHTML = "";

  if (!list || list.length === 0) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No tasks yet.";
    els.taskList.appendChild(li);
    return;
  }

  for (const task of list) {
    const node = els.template.content.cloneNode(true);

    node.querySelector(".item-title").textContent = task.title;
    node.querySelector(".item-desc").textContent = task.description || "";
    node.querySelector(".badge").textContent = task.status;
    node.querySelector(".item-date").textContent =
      task.createdAt ? `Created: ${new Date(task.createdAt).toLocaleString()}` : "";

    node.querySelector(".editBtn").addEventListener("click", () => {
      hideMessage();
      setFormModeEdit(task);
    });

    node.querySelector(".deleteBtn").addEventListener("click", () => {
      hideMessage();
      const ok = confirm(`Delete "${task.title}"?`);
      if (!ok) return;

      tasks = tasks.filter((t) => t.id !== task.id);
      showMessage("Task deleted ✅");
      setFormModeCreate();
      renderTasks(tasks);
    });

    els.taskList.appendChild(node);
  }
}

// ----- Actions -----
function createTask({ title, description, status }) {
  const task = {
    id: String(Date.now()),
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(task); // newest at top
}

function updateTask(id, { title, description, status }) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;

  tasks[idx] = { ...tasks[idx], title, description, status };
  return true;
}

// ----- Events -----
els.taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideMessage();

  const { id, title, description, status } = getFormData();

  if (!title) {
    showMessage("Title is required.", true);
    return;
  }

  if (!id) {
    createTask({ title, description, status });
    showMessage("Task created ✅");
  } else {
    const ok = updateTask(id, { title, description, status });
    showMessage(ok ? "Task updated ✅" : "Task not found ❌", !ok);
  }

  setFormModeCreate();
  renderTasks(tasks);
});

els.cancelBtn.addEventListener("click", () => {
  hideMessage();
  setFormModeCreate();
});

els.refreshBtn.addEventListener("click", () => {
  hideMessage();
  renderTasks(tasks);
});

// ----- Init -----
setFormModeCreate();
renderTasks(tasks);
