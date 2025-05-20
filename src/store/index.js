import Vue from "vue";
import Vuex from "vuex";
import { io } from "socket.io-client";

Vue.use(Vuex);

// --- Create the Socket.io instance here ---
const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
  {}
);

export default new Vuex.Store({
  state: {
    tasks: [],
    isLoading: false,
    error: null,
    searchTerm: "",
    filterBy: "all", // 'all', 'active', 'completed'
    sortBy: "createdAt", // 'createdAt', 'priority'
    isDarkMode: false,
    isConnected: false,
    socketError: null,
  },
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    ADD_TASK(state, task) {
      state.tasks.unshift(task);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      if (index !== -1) {
        Vue.set(state.tasks, index, updatedTask);
      }
    },
    REMOVE_TASK(state, taskId) {
      state.tasks = state.tasks.filter((task) => task._id !== taskId);
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SEARCH_TERM(state, term) {
      state.searchTerm = term;
    },
    SET_FILTER_BY(state, filter) {
      state.filterBy = filter;
    },
    SET_SORT_BY(state, sort) {
      state.sortBy = sort;
      if (sort === "createdAt") {
        state.tasks.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sort === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        state.tasks.sort(
          (a, b) =>
            (priorityOrder[a.priority] || 99) -
            (priorityOrder[b.priority] || 99)
        );
      }
    },
    TOGGLE_DARK_MODE(state) {
      state.isDarkMode = !state.isDarkMode;
      // ... DOM manipulation for dark mode (consider moving out of store if not SSR) ...
      if (state.isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    },
    INITIALIZE_THEME(state) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        state.isDarkMode = true;
        document.documentElement.classList.add("dark");
      } else if (savedTheme === "light") {
        state.isDarkMode = false;
        document.documentElement.classList.remove("dark");
      } else if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        state.isDarkMode = true;
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    },
    SET_CONNECTED(state, status) {
      state.isConnected = status;
    },
    SET_SOCKET_ERROR(state, error) {
      state.socketError = error;
    },
  },
  actions: {
    initSocket({ commit, dispatch }) {
      // Clean up existing listeners to avoid duplicates
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("newTask");
      socket.off("updatedTask");
      socket.off("removedTask");

      socket.on("connect", () => {
        console.log("Socket.io client connected");
        commit("SET_CONNECTED", true);
        commit("SET_SOCKET_ERROR", null);
      });

      socket.on("disconnect", () => {
        console.log("Socket.io client disconnected");
        commit("SET_CONNECTED", false);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket.io connection error:", err);
        commit("SET_SOCKET_ERROR", err.message);
        commit("SET_CONNECTED", false);
      });

      socket.on("newTask", (newTask) => {
        console.log('Received "newTask" event via Socket.io:', newTask);
        dispatch("handleNewTask", newTask);
      });

      socket.on("updatedTask", (updatedTask) => {
        console.log('Received "updatedTask" event via Socket.io:', updatedTask);
        dispatch("handleUpdateTask", updatedTask);
      });

      socket.on("removedTask", (taskId) => {
        console.log('Received "removedTask" event via Socket.io:', taskId);
        dispatch("handleRemoveTask", taskId);
      });

      if (!socket.connected) {
        socket.connect();
      }
    },

    handleNewTask({ commit }, newTask) {
      commit("ADD_TASK", newTask);
    },

    handleUpdateTask({ commit }, updatedTask) {
      commit("UPDATE_TASK", updatedTask);
    },

    handleRemoveTask({ commit }, taskId) {
      commit("REMOVE_TASK", taskId);
    },

    // Initialize theme on app load
    initializeTheme({ commit }) {
      commit("INITIALIZE_THEME");
    },

    // Action to fetch initial tasks from the backend API
    async fetchTasks({ commit }) {
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      if (!apiUrl) {
        console.error(".env variable VITE_BACKEND_URL is not defined!");
        commit(
          "SET_ERROR",
          "Application configuration error: BACKEND_URL URL missing."
        );
        return;
      }
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const response = await fetch(`${apiUrl}/tasks`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }
        const tasks = await response.json();
        commit("SET_TASKS", tasks);
        commit("SET_LOADING", false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        commit("SET_ERROR", error.message || "Failed to fetch tasks.");
        commit("SET_LOADING", false);
      }
    },

    createTask({}, taskData) {
      console.log("Emitting createTask event with:", taskData);
      socket.emit("createTask", taskData);
    },

    updateTask({}, taskData) {
      console.log("Emitting updateTask event with:", taskData);
      socket.emit("updateTask", taskData);
    },

    deleteTask({}, taskId) {
      console.log("Emitting deleteTask event with:", taskId);
      socket.emit("deleteTask", taskId);
    },

    setSearchTerm({ commit }, term) {
      commit("SET_SEARCH_TERM", term);
    },
    setFilterBy({ commit }, filter) {
      commit("SET_FILTER_BY", filter);
    },
    setSortBy({ commit }, sort) {
      commit("SET_SORT_BY", sort);
    },
    toggleDarkMode({ commit }) {
      commit("TOGGLE_DARK_MODE");
    },
  },
  getters: {
    baseTasks: (state) => state.tasks,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error,
    isDarkMode: (state) => state.isDarkMode,
    isConnected: (state) => state.isConnected,
    socketConnectionError: (state) => state.socketError,

    filteredAndSortedTasks: (state, getters) => {
      let tasks = [...getters.baseTasks];

      // Filter by search term
      if (state.searchTerm) {
        tasks = tasks.filter(
          (task) =>
            task.name &&
            task.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }

      // Filter by completion status
      if (state.filterBy === "active") {
        tasks = tasks.filter((task) => !task.completed);
      } else if (state.filterBy === "completed") {
        tasks = tasks.filter((task) => task.completed);
      }

      // Sort tasks (This sorting logic is better placed in the getter or a computed prop in component if state.sortBy is only for display)
      // If you rely *only* on this getter for sorting, the base tasks array isn't sorted.

      if (state.sortBy === "createdAt") {
        tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first
      } else if (state.sortBy === "priority") {
        const priorityOrder = { High: 1, Medium: 2, Low: 3, undefined: 99 }; // Handle missing priority
        tasks.sort(
          (a, b) =>
            (priorityOrder[a.priority] || 99) -
            (priorityOrder[b.priority] || 99)
        );
      } else if (state.sortBy === "order") {
        tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
      }

      return tasks;
    },
  },
});
