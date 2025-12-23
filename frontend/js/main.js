import { getTasks, createTask, updateTask, deleteTask } from "./api.js";

// ---- Helpers ----
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // if you stored it in login.js
  window.location.href = "login.html";
}

// ---- Auth guard ----
if (!localStorage.getItem("token")) {
  logout();
}

const els = {
  taskList: document.getElementById("taskList"),
  template: document.getElementById("taskItemTemplate"),

  taskForm: document.getElementById("taskForm"),
  taskId: document.getElementById("taskId"),
  title: document.getElementById("title"),
  description: document.getElementById("description"),
  status: document.getElementById("status"),

  formTitle: document.getElementById("formTitle"),
  cancelBtn: document.getElementById("cancelBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  message: document.getElementById("message"),

  // NEW: logout button (add it in index.html)
  logoutBtn: document.getElementById("logoutBtn"),
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

function setCreateMode() {
  els.formTitle.textContent = "Create Task";
  els.taskId.value = "";
  els.title.value = "";
  els.description.value = "";
  els.status.value = "open";
  els.cancelBtn.hidden = true;
}

function setEditMode(task) {
  els.formTitle.textContent = "Edit Task";
  els.taskId.value = task._id || task.id || "";
  els.title.value = task.title || "";
  els.description.value = task.description || "";
  els.status.value = task.status || "open";
  els.cancelBtn.hidden = false;
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
    const node = els.template.content.cloneNode(true);

    node.querySelector(".item-title").textContent = task.title || "(no title)";
    node.querySelector(".badge").textContent = task.status || "open";
    node.querySelector(".item-desc").textContent = task.description || "";
    node.querySelector(".item-date").textContent =
      task.createdAt ? `Created: ${new Date(task.createdAt).toLocaleString()}` : "";

    node.querySelector(".editBtn").addEventListener("click", () => {
      hideMessage();
      setEditMode(task);
    });

    node.querySelector(".deleteBtn").addEventListener("click", async () => {
      hideMessage();

      const ok = confirm(`Delete "${task.title}"?`);
      if (!ok) return;

      try {
        const id = task._id || task.id;
        await deleteTask(id);
        showMessage("Task deleted ✅");
        await loadTasks();
        setCreateMode();
      } catch (err) {
        const msg = String(err.message || "");
        if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
          logout();
          return;
        }
        showMessage(`Delete failed: ${err.message}`, true);
        console.error(err);
      }
    });

    els.taskList.appendChild(node);
  }
}

async function loadTasks() {
  try {
    const res = await getTasks();
    renderTasks(res.data);
  } catch (err) {
    renderTasks([]);
    const msg = String(err.message || "");
    // If token expired/invalid -> redirect to login
    if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
      logout();
      return;
    }
    showMessage(`Failed to load: ${err.message}`, true);
    console.error(err);
  }
}

els.taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const id = els.taskId.value.trim();
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
    if (!id) {
      await createTask(payload);
      showMessage("Task created ✅");
    } else {
      await updateTask(id, payload);
      showMessage("Task updated ✅");
    }

    await loadTasks();
    setCreateMode();
  } catch (err) {
    const msg = String(err.message || "");
    if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
      logout();
      return;
    }
    showMessage(`Save failed: ${err.message}`, true);
    console.error(err);
  }
});

els.cancelBtn.addEventListener("click", () => {
  hideMessage();
  setCreateMode();
});

els.refreshBtn.addEventListener("click", () => {
  hideMessage();
  loadTasks();
});

// NEW: logout click
if (els.logoutBtn) {
  els.logoutBtn.addEventListener("click", () => {
    const ok = confirm("Logout now?");
    if (!ok) return;
    logout();
  });
}

// init
setCreateMode();
loadTasks();
