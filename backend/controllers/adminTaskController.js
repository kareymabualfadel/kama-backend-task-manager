const Task = require("../models/Task");
const User = require("../models/User");

// GET /api/admin/tasks - Get all tasks (with optional user filter)
async function listAllTasks(req, res, next) {
  try {
    const { userId } = req.query;
    const filter = userId ? { owner: userId } : {};
    const tasks = await Task.find(filter)
      .populate("owner", "_id username")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/tasks - Create task for a specific user
async function createTaskForUser(req, res, next) {
  try {
    const { userId, title, description, status } = req.body || {};

    if (!userId) {
      return res.status(400).json({ success: false, error: "userId is required" });
    }
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: typeof description === "string" ? description.trim() : "",
      status: status === "done" ? "done" : "open",
      owner: userId,
    });

    // Populate owner info
    await task.populate("owner", "_id username");
    return res.status(201).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid userId" });
    }
    next(err);
  }
}

// PUT /api/admin/tasks/:id - Update any task
async function updateTaskForUser(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body || {};

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
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
    await task.populate("owner", "_id username");
    return res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ success: false, error: "Invalid task id" });
    }
    next(err);
  }
}

// DELETE /api/admin/tasks/:id - Delete any task
async function deleteTaskForUser(req, res, next) {
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

module.exports = {
  listAllTasks,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
};
