import express from "express";
import Task from "./Task.js";

const router = express.Router();

// @route   GET api/tasks
// @desc    Get all tasks
// @access  Public
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ order: 1 }); // Default sort by custom order
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/tasks
// @desc    Create a task (primarily for initial setup or non-socket clients)
// @access  Public
router.post("/tasks", async (req, res) => {
  const { name, priority } = req.body;
  try {
    const newTask = new Task({
      name,
      priority,
      // order will be set by pre-save hook or explicitly if needed
    });
    const task = await newTask.save();
    // For REST API, we send back the task. Socket.io will broadcast.
    res.status(201).json(task);
    // Note: In a pure Socket.io driven app, this REST endpoint might just be for initial creation
    // and the socket handler would be primary.
  } catch (err) {
    console.error(err.message);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ msg: "Validation error", errors: err.errors });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/tasks/order
// @desc    Update the order of multiple tasks
// @access  Public
router.put("/tasks/order", async (req, res) => {
  const { orderedTasks } = req.body; // Expects an array of { _id: String, order: Number }
  try {
    const bulkOps = orderedTasks.map((task) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { $set: { order: task.order } },
      },
    }));
    await Task.bulkWrite(bulkOps);
    res.json({ msg: "Tasks order updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
