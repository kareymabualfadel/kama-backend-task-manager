const Task = require("../models/Task");

// GET /api/tasks (only my tasks unless admin)
async function getAllTasks(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
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
      owner: req.user._id,
    });

    return res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body || {};

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    const isOwner = task.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ success: false, error: "Title must be non-empty" });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = typeof description === "string" ? description.trim() : "";
    }

    if (status !== undefined) {
      task.status = status === "done" ? "done" : "open";
    }

    await task.save();
    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid task id" });
    }
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ success: false, error: "Task not found" });

    const isOwner = task.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    await Task.deleteOne({ _id: id });
    return res.status(200).json({ success: true, message: "Task deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid task id" });
    }
    next(err);
  }
}

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
