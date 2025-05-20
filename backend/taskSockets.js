import Task from "./Task.js";

/**
 * @typedef {Object} TaskData
 * @property {string} name
 * @property {'Low'|'Medium'|'High'} [priority]
 *
 * @typedef {Object} TaskUpdateData
 * @property {string} _id
 * @property {string} [name]
 * @property {boolean} [completed]
 * @property {'Low'|'Medium'|'High'} [priority]
 */

/**
 * Configures Socket.IO handlers
 * @returns {void}
 */
export default function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Send initial task list to new client
    Task.find()
      .sort({ order: 1 })
      .then((tasks) => socket.emit("initialTasks", tasks))
      .catch((err) => console.error("Initial tasks error:", err));

    /**
     * @param {TaskData} data - Task creation data
     */
    socket.on("createTask", async (data) => {
      try {
        const newTask = new Task({
          name: data.name,
          priority: data.priority || "Medium",
        });
        const savedTask = await newTask.save();
        io.emit("newTask", savedTask);
      } catch (err) {
        console.error("Error creating task:", err);
        socket.emit("taskError", {
          message: "Failed to create task",
          error: err.message,
        });
      }
    });

    /**
     * @param {TaskUpdateData} updatedTaskData - Updated task properties
     */
    socket.on("updateTask", async (updatedTaskData) => {
      try {
        const task = await Task.findById(updatedTaskData._id);
        if (!task)
          return socket.emit("taskError", { message: "Task not found" });

        // Update mutable fields
        task.name = updatedTaskData.name ?? task.name;
        task.completed = updatedTaskData.completed ?? task.completed;
        task.priority = updatedTaskData.priority ?? task.priority;

        const savedTask = await task.save();
        io.emit("updatedTask", savedTask);
      } catch (err) {
        console.error("Error updating task:", err);
        socket.emit("taskError", {
          message: "Failed to update task",
          error: err.message,
        });
      }
    });

    /**
     * @param {string} taskId - MongoDB ID of task to delete
     */
    socket.on("deleteTask", async (taskId) => {
      try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
          return socket.emit("taskError", {
            message: "Task not found for deletion",
          });
        }
        io.emit("removedTask", taskId);
      } catch (err) {
        console.error("Error deleting task:", err);
        socket.emit("taskError", {
          message: "Failed to delete task",
          error: err.message,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}
