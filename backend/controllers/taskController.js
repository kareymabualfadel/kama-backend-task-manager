const tasks = require("../data/tasks");

function getAllTasks(req, res) {
  return res.status(200).json({
    success: true,
    data: tasks,
  });
}


function createTask(req, res) {
  const { title, description, status } = req.body || {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: "Title is required",
    });
  }

  const task = {
    id: String(Date.now()),
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
    status: status === "done" ? "done" : "open",
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);

  return res.status(201).json({
    success: true,
    data: task,
  });
}


function updateTask(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body || {};

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: "Task not found",
    });
  }

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      error: "Title is required",
    });
  }

  task.title = title.trim();
  task.description = typeof description === "string" ? description.trim() : "";
  task.status = status === "done" ? "done" : "open";

  return res.status(200).json({
    success: true,
    data: task,
  });
}


function deleteTask(req, res) {
  const { id } = req.params;

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Task not found",
    });
  }

  tasks.splice(index, 1);

  return res.status(200).json({
    success: true,
  });
}

module.exports = {getAllTasks, createTask, updateTask, deleteTask};