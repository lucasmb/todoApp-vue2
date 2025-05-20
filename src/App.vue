<template>
  <div
    id="app"
    class="min-h-screen font-sans antialiased dark:bg-gray-900"
    :class="{ dark: isDarkMode }"
  >
    <div class="container mx-auto p-4 max-w-3xl">
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-primary dark:text-primary-light">
          To-Do App
        </h1>
        <ThemeToggle />
      </header>

      <NewTask @new-task="handleNewTask" class="mb-8" />

      <div class="mb-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4"
        >
          <div class="relative w-full sm:w-1/2">
            <input
              type="text"
              :value="searchTerm"
              @input="updateSearchTerm($event.target.value)"
              placeholder="Search tasks..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div class="flex gap-2 items-center">
            <select
              :value="filterBy"
              @change="updateFilterBy($event.target.value)"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              :value="sortBy"
              @change="updateSortBy($event.target.value)"
              class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="createdAt">Date Created</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <div
          v-if="socketConnectionError"
          class="text-center py-2 text-red-500 dark:text-red-400 text-sm"
        >
          Connection Error: {{ socketConnectionError }}. Ensure backend is
          running.
        </div>
        <div
          v-else-if="!isConnected"
          class="text-center py-2 text-yellow-600 dark:text-yellow-400 text-sm"
        >
          Connecting to server...
        </div>
        <!-- <div
          v-else
          class="text-center py-2 text-green-600 dark:text-green-400 text-sm"
        >
          Connected. Real-time updates active.
        </div> -->

        <div v-if="isLoading" class="text-center py-4">
          <p class="text-gray-500 dark:text-gray-400">Loading tasks...</p>
        </div>
        <div
          v-else-if="error"
          class="text-center py-4 text-red-500 dark:text-red-400"
        >
          <p>Error loading tasks: {{ error }}</p>
        </div>
        <TaskList
          v-else
          :tasks="filteredAndSortedTasks"
          @task-updated="handleTaskUpdate"
          @task-deleted="handleTaskDelete"
        />
      </div>

      <footer
        class="text-center mt-12 text-sm text-gray-500 dark:text-gray-400"
      >
        <p>&copy; {{ new Date().getFullYear() }} To-Do App</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import NewTask from "./components/NewTask.vue";
import TaskList from "./components/TaskList.vue";
import ThemeToggle from "./components/ThemeToggle.vue";

export default {
  name: "App",
  components: {
    NewTask,
    TaskList,
    ThemeToggle,
  },
  computed: {
    ...mapState(["isLoading", "error", "searchTerm", "filterBy", "sortBy"]),
    ...mapGetters([
      "filteredAndSortedTasks",
      "isDarkMode",
      "isConnected",
      "socketConnectionError",
    ]),
  },
  methods: {
    ...mapActions([
      "createTask",
      "updateTask",
      "deleteTask",
      "reorderTasks",
      "setSearchTerm",
      "setFilterBy",
      "setSortBy",
      "initializeTheme",
      "initSocket",
      "fetchTasks",
    ]),

    handleNewTask(taskData) {
      this.createTask(taskData);
    },
    handleTaskUpdate(taskData) {
      this.updateTask(taskData);
    },
    handleTaskDelete(taskId) {
      this.deleteTask(taskId);
    },

    updateSearchTerm(term) {
      this.setSearchTerm(term);
    },
    updateFilterBy(filter) {
      this.setFilterBy(filter);
    },
    updateSortBy(sort) {
      this.setSortBy(sort);
    },
  },
  created() {
    // Initialize theme first
    this.initializeTheme();

    this.initSocket(); // Initialize socket listeners and connect
    this.fetchTasks(); // Fetch initial tasks
  },
};
</script>

<style></style>
