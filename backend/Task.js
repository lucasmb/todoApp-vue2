import mongoose from "mongoose";

/**
 * Mongoose schema for managing tasks with automatic ordering
 * @typedef {Object} TaskSchema
 * @property {string} name - The name of the task (auto-trimmed)
 * @property {boolean} [completed=false] - Completion status of the task
 * @property {Date} [createdAt=Date.now] - Timestamp of task creation
 * @property {'Low'|'Medium'|'High'} [priority='Medium'] - Priority level of the task
 * @property {number} [order=0] - Position in ordered lists
 */
const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Task name is required"],
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  order: {
    type: Number,
    default: 0,
  },
});

/**
 * Auto-increment order for new tasks when not explicitly set.
 */
TaskSchema.pre("save", async function (next) {
  if (this.isNew && this.order === 0) {
    const lastTask = await this.constructor.findOne().sort("-order");
    this.order = lastTask ? lastTask.order + 1 : 1;
  }
  next();
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
