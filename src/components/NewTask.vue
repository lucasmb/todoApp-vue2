<template>
  <form
    @submit.prevent="submitTask"
    class="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
  >
    <div class="mb-4">
      <label
        for="taskName"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >Task Name</label
      >
      <input
        type="text"
        id="taskName"
        v-model.trim="taskName"
        required
        placeholder="e.g. Buy coffee capsules"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200"
      />
    </div>
    <div class="mb-6">
      <label
        for="taskPriority"
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >Priority</label
      >
      <select
        id="taskPriority"
        v_model="taskPriority"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200"
      >
        <option value="Low">Low</option>
        <option value="Medium" selected>Medium</option>
        <option value="High">High</option>
      </select>
    </div>
    <button
      type="submit"
      class="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light dark:focus:ring-offset-gray-800"
    >
      Add Task
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      taskName: "",
      taskPriority: "Medium",
    };
  },
  methods: {
    submitTask() {
      if (!this.taskName) {
        // Basic validation,
        alert("Task name cannot be empty.");
        return;
      }
      this.$emit("new-task", {
        name: this.taskName,
        priority: this.taskPriority,
      });
      this.taskName = "";
      this.taskPriority = "Medium"; // Reset form
    },
  },
};
</script>
