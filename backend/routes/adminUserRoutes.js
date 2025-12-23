const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middleware/auth");
const { listUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");

router.use(protect);
router.use(requireRole("admin"));

router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
