<template>
  <li
    ref="taskItemRef"
    class="task-item group flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 transition-colors duration-150"
    :class="{ 'completed-task-style': task.completed }"
  >
    <div class="flex items-center flex-grow">
      <input
        type="checkbox"
        :checked="task.completed"
        @change="handleToggleComplete"
        class="form-checkbox h-5 w-5 text-primary rounded border-gray-300 dark:border-gray-500 focus:ring-primary-light dark:bg-gray-600 dark:checked:bg-primary flex-shrink-0"
      />
      <div class="ml-3 flex-grow min-w-0">
        <p
          ref="taskNameRef"
          class="text-base font-medium text-gray-800 dark:text-gray-100 truncate"
          :class="{
            'line-through text-gray-500 dark:text-gray-400': task.completed,
          }"
        >
          {{ task.name }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Created: {{ formattedCreationDate }}
        </p>
      </div>
    </div>

    <div class="flex items-center space-x-2 sm:space-x-3 ml-2 flex-shrink-0">
      <span
        class="px-2 py-0.5 text-xs font-semibold rounded-full"
        :class="priorityClasses(task.priority)"
      >
        {{ task.priority }}
      </span>
      <select
        v-model="editablePriority"
        @change="changePriority"
        class="text-xs p-1 border border-gray-300 dark:border-gray-500 rounded bg-gray-50 dark:bg-gray-600 focus:ring-1 focus:ring-primary dark:text-gray-200 appearance-none"
        :class="prioritySelectTextClasses(editablePriority)"
        aria-label="Change priority"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        @click="confirmDelete"
        class="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </li>
</template>

<script>
import { createTimeline } from "animejs";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editablePriority: this.task.priority,
    };
  },
  computed: {
    formattedCreationDate() {
      const date = new Date(this.task.createdAt);
      const options = { weekday: "short" };
      const weekday = date.toLocaleDateString("en-US", options);
      const day = date.getDate();
      const year = date.getFullYear();
      return `${weekday} ${day} ${year}`;
    },
  },
  methods: {
    handleToggleComplete() {
      const newCompletedState = !this.task.completed;
      this.animateCompletion(newCompletedState);
      this.$emit("task-updated", {
        ...this.task,
        completed: newCompletedState,
      });
    },
    animateCompletion(isCompleted) {
      const taskItem = this.$refs.taskItemRef;
      const taskName = this.$refs.taskNameRef;

      if (!taskItem || !taskName) return;

      if (isCompleted) {
        const tl = createTimeline({ defaults: { duration: 750 } });
        tl.add(taskItem, { ease: "easeOutExpo" });
        tl.add(taskItem, { opacity: [1, 0.7, 1] }, 600);
      } else {
        const tl = createTimeline({ defaults: { duration: 750 } });
        tl.add(taskItem, { ease: "easeOutExpo" });
        tl.add(taskItem, { opacity: [0.7, 1] }, 300);
        tl.add(
          taskName,
          {
            text: ["#9CA3AF", "#374151"],
            duration: 300,
          },
          "-=200"
        );
      }
    },
    confirmDelete() {
      if (
        window.confirm(`Are you sure you want to delete "${this.task.name}"?`)
      ) {
        this.$emit("task-deleted", this.task._id);
      }
    },
    priorityClasses(priority) {
      return {
        "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100":
          priority === "High",
        "bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100":
          priority === "Medium",
        "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100":
          priority === "Low",
      };
    },
    prioritySelectTextClasses(priority) {
      return {
        "text-priority-high": priority === "High",
        "text-priority-medium": priority === "Medium",
        "text-priority-low": priority === "Low",
      };
    },

    changePriority() {
      if (this.editablePriority !== this.task.priority) {
        this.$emit("task-updated", {
          ...this.task,
          priority: this.editablePriority,
        });
      }
    },
  },
};
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
