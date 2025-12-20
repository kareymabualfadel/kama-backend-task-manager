const express = require("express");
const router = express.Router();

const {  getAllTasks,createTask,updateTask,deleteTask,} = require("../controllers/taskController.js");
const { validateTask } = require("../middleware/validateTask");
const authenticate = require("../middleware/auth");

router.use(authenticate);



router.get("/", getAllTasks);
router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);





module.exports = router;