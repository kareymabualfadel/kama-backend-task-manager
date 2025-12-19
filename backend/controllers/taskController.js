const Task = require("../models/Task");

// GET /api/tasks
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const { title, description, status } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      status: status === "done" ? "done" : "open",
    });

    return res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body || {};

    const update = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          error: "Title must be a non-empty string",
        });
      }
      update.title = title.trim();
    }

    if (description !== undefined) {
      update.description = typeof description === "string" ? description.trim() : "";
    }

    if (status !== undefined) {
      update.status = status === "done" ? "done" : "open";
    }

    const task = await Task.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    // Invalid ObjectId ends up here
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid task id" });
    }
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid task id" });
    }
    next(err);
  }
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
