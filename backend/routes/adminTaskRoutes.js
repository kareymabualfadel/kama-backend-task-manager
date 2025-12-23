const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/auth");
const {
  listAllTasks,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
} = require("../controllers/adminTaskController");

router.use(protect);
router.use(requireRole("admin"));

router.get("/", listAllTasks);
router.post("/", createTaskForUser);
router.put("/:id", updateTaskForUser);
router.delete("/:id", deleteTaskForUser);

module.exports = router;
