import * as api from "./api.js";

// =============== STATE ===============
let currentAdminUser = null;
let allUsers = [];
let allTasks = [];

// =============== INITIALIZATION ===============
async function init() {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      window.location.href = "./login.html";
      return;
    }

    currentAdminUser = JSON.parse(userData);

    if (currentAdminUser.role !== "admin") {
      alert("Access denied. Admin only.");
      window.location.href = "./index.html";
      return;
    }

    setupEventListeners();
    await loadAllData();
  } catch (err) {
    console.error("Init error:", err);
    window.location.href = "./login.html";
  }
}

// =============== EVENT LISTENERS ===============
function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", logout);

  // Create User Form
  document.getElementById("createUserForm").addEventListener("submit", handleCreateUser);

  // Admin Task Form (My Tasks)
  document.getElementById("adminTaskForm").addEventListener("submit", handleCreateAdminTask);

  // User Filter for Users' Tasks
  document.getElementById("userFilter").addEventListener("change", loadUserTasksForTab);

  // Modal close buttons
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.closest("#editUserModal")) {
        closeModal("editUserModal");
      } else if (e.target.closest("#editTaskModal")) {
        closeModal("editTaskModal");
      }
    });
  });

  // Edit forms
  document.getElementById("editUserForm").addEventListener("submit", handleUpdateUser);
  document.getElementById("editTaskForm").addEventListener("submit", handleUpdateTask);

  // Cancel button for admin task
  document.getElementById("cancelAdminTaskBtn").addEventListener("click", resetAdminTaskForm);
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabName).classList.add("active");

  // Mark button as active
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
}

// =============== LOAD DATA ===============
async function loadAllData() {
  try {
    // Load users
    const usersRes = await api.getAdminUsers();
    if (usersRes.success) {
      allUsers = usersRes.data;
      renderUsersTable();
      populateUserFilter();
    }

    // Load all tasks
    const tasksRes = await api.getAdminAllTasks();
    if (tasksRes.success) {
      allTasks = tasksRes.data;
    }

    // Load admin's own tasks
    loadAdminTasks();
  } catch (err) {
    console.error("Load data error:", err);
    alert("Error loading data");
  }
}

async function loadAdminTasks() {
  try {
    const res = await api.getTasks();
    if (res.success) {
      renderAdminTasksTable(res.data);
    }
  } catch (err) {
    console.error("Load admin tasks error:", err);
  }
}

async function loadUserTasksForTab() {
  const userId = document.getElementById("userFilter").value;
  if (!userId) {
    document.getElementById("usersTasksContainer").innerHTML =
      '<div class="empty-state"><p>Select a user to manage their tasks</p></div>';
    return;
  }

  try {
    const res = await api.getAdminTasksForUser(userId);
    if (res.success) {
      renderUserTasksForManagement(res.data);
    }
  } catch (err) {
    console.error("Load user tasks error:", err);
    alert("Error loading tasks");
  }
}

// =============== RENDER FUNCTIONS ===============
function renderUsersTable() {
  const container = document.getElementById("usersContainer");

  if (allUsers.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No users found</p></div>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Role</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  allUsers.forEach((user) => {
    const created = new Date(user.createdAt).toLocaleDateString();
    html += `
      <tr>
        <td>${escapeHtml(user.username)}</td>
        <td>${user.role}</td>
        <td>${created}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small edit" onclick="window.editUser('${user._id}')">Edit</button>
            <button class="btn-small delete" onclick="window.deleteUser('${user._id}', '${escapeHtml(user.username)}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

function renderAdminTasksTable(tasks) {
  const container = document.getElementById("adminTasksContainer");

  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No tasks created yet</p></div>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  tasks.forEach((task) => {
    const created = new Date(task.createdAt).toLocaleDateString();
    const statusClass = task.status === "done" ? "done" : "open";
    html += `
      <tr>
        <td>${escapeHtml(task.title)}</td>
        <td>${escapeHtml(task.description)}</td>
        <td><span class="status-badge ${statusClass}">${task.status}</span></td>
        <td>${created}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small edit" onclick="window.editAdminTask('${task._id}')">Edit</button>
            <button class="btn-small delete" onclick="window.deleteAdminTask('${task._id}', '${escapeHtml(task.title)}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

function renderUserTasksForManagement(tasks) {
  const container = document.getElementById("usersTasksContainer");

  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>This user has no tasks</p></div>';
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;

  tasks.forEach((task) => {
    const created = new Date(task.createdAt).toLocaleDateString();
    const statusClass = task.status === "done" ? "done" : "open";
    const ownerName = task.owner?.username || "Unknown";
    html += `
      <tr>
        <td>${escapeHtml(task.title)}</td>
        <td>${escapeHtml(task.description)}</td>
        <td><span class="status-badge ${statusClass}">${task.status}</span></td>
        <td>${ownerName}</td>
        <td>${created}</td>
        <td>
          <div class="action-buttons">
            <button class="btn-small edit" onclick="window.editUserTask('${task._id}')">Edit</button>
            <button class="btn-small delete" onclick="window.deleteUserTask('${task._id}', '${escapeHtml(task.title)}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

function populateUserFilter() {
  const select = document.getElementById("userFilter");
  select.innerHTML = '<option value="">-- All Users --</option>';

  allUsers.forEach((user) => {
    const option = document.createElement("option");
    option.value = user._id;
    option.textContent = user.username;
    select.appendChild(option);
  });
}

// =============== FORM HANDLERS ===============
async function handleCreateUser(e) {
  e.preventDefault();

  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const role = document.getElementById("newRole").value;

  try {
    const res = await api.createAdminUser({
      username,
      password,
      role,
    });

    if (res.success) {
      alert("User created successfully");
      document.getElementById("createUserForm").reset();
      await loadAllData();
    } else {
      alert("Error: " + (res.error || "Failed to create user"));
    }
  } catch (err) {
    console.error("Create user error:", err);
    alert("Error creating user");
  }
}

async function handleCreateAdminTask(e) {
  e.preventDefault();

  const title = document.getElementById("adminTaskTitle").value.trim();
  const description = document.getElementById("adminTaskDescription").value.trim();
  const status = document.getElementById("adminTaskStatus").value;

  try {
    const res = await api.createTask({
      title,
      description,
      status,
    });

    if (res.success) {
      alert("Task created successfully");
      document.getElementById("adminTaskForm").reset();
      resetAdminTaskForm();
      await loadAdminTasks();
    } else {
      alert("Error: " + (res.error || "Failed to create task"));
    }
  } catch (err) {
    console.error("Create task error:", err);
    alert("Error creating task");
  }
}

async function handleUpdateUser(e) {
  e.preventDefault();

  const id = document.getElementById("editUserId").value;
  const username = document.getElementById("editUsername").value.trim();
  const password = document.getElementById("editPassword").value.trim();
  const role = document.getElementById("editRole").value;

  const payload = { username, role };
  if (password) {
    payload.password = password;
  }

  try {
    const res = await api.updateAdminUser(id, payload);

    if (res.success) {
      alert("User updated successfully");
      closeModal("editUserModal");
      await loadAllData();
    } else {
      alert("Error: " + (res.error || "Failed to update user"));
    }
  } catch (err) {
    console.error("Update user error:", err);
    alert("Error updating user");
  }
}

async function handleUpdateTask(e) {
  e.preventDefault();

  const id = document.getElementById("editTaskId").value;
  const title = document.getElementById("editTaskTitle").value.trim();
  const description = document.getElementById("editTaskDescription").value.trim();
  const status = document.getElementById("editTaskStatus").value;

  try {
    const res = await api.updateAdminTask(id, {
      title,
      description,
      status,
    });

    if (res.success) {
      alert("Task updated successfully");
      closeModal("editTaskModal");
      await loadAdminTasks();
      await loadUserTasksForTab();
    } else {
      alert("Error: " + (res.error || "Failed to update task"));
    }
  } catch (err) {
    console.error("Update task error:", err);
    alert("Error updating task");
  }
}

// =============== EDIT/DELETE FUNCTIONS (Global for onclick) ===============
window.editUser = async function (userId) {
  const user = allUsers.find((u) => u._id === userId);
  if (!user) return;

  document.getElementById("editUserId").value = user._id;
  document.getElementById("editUsername").value = user.username;
  document.getElementById("editPassword").value = "";
  document.getElementById("editRole").value = user.role;

  openModal("editUserModal");
};

window.deleteUser = async function (userId, username) {
  if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;

  try {
    const res = await api.deleteAdminUser(userId);

    if (res.success) {
      alert("User deleted successfully");
      await loadAllData();
    } else {
      alert("Error: " + (res.error || "Failed to delete user"));
    }
  } catch (err) {
    console.error("Delete user error:", err);
    alert("Error deleting user");
  }
};

window.editAdminTask = async function (taskId) {
  // Find task in all tasks
  let task = allTasks.find((t) => t._id === taskId);

  if (!task) {
    // If not found, fetch again
    const res = await api.getAdminAllTasks();
    if (res.success) {
      task = res.data.find((t) => t._id === taskId);
    }
  }

  if (!task) return;

  document.getElementById("editTaskId").value = task._id;
  document.getElementById("editTaskTitle").value = task.title;
  document.getElementById("editTaskDescription").value = task.description;
  document.getElementById("editTaskStatus").value = task.status;

  openModal("editTaskModal");
};

window.deleteAdminTask = async function (taskId, taskTitle) {
  if (!confirm(`Are you sure you want to delete task "${taskTitle}"?`)) return;

  try {
    const res = await api.deleteAdminTask(taskId);

    if (res.success) {
      alert("Task deleted successfully");
      await loadAdminTasks();
      await loadUserTasksForTab();
    } else {
      alert("Error: " + (res.error || "Failed to delete task"));
    }
  } catch (err) {
    console.error("Delete task error:", err);
    alert("Error deleting task");
  }
};

window.editUserTask = async function (taskId) {
  const userId = document.getElementById("userFilter").value;
  const res = await api.getAdminTasksForUser(userId);
  let task = res.data?.find((t) => t._id === taskId);

  if (!task) return;

  document.getElementById("editTaskId").value = task._id;
  document.getElementById("editTaskTitle").value = task.title;
  document.getElementById("editTaskDescription").value = task.description;
  document.getElementById("editTaskStatus").value = task.status;

  openModal("editTaskModal");
};

window.deleteUserTask = async function (taskId, taskTitle) {
  if (!confirm(`Are you sure you want to delete task "${taskTitle}"?`)) return;

  try {
    const res = await api.deleteAdminTask(taskId);

    if (res.success) {
      alert("Task deleted successfully");
      await loadUserTasksForTab();
    } else {
      alert("Error: " + (res.error || "Failed to delete task"));
    }
  } catch (err) {
    console.error("Delete user task error:", err);
    alert("Error deleting task");
  }
};

// =============== UTILITY FUNCTIONS ===============
function resetAdminTaskForm() {
  document.getElementById("adminTaskForm").reset();
  document.getElementById("cancelAdminTaskBtn").hidden = true;
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "./login.html";
}

// =============== START ===============
init();
