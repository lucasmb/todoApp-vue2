<template>
  <div class="task-list-container">
    <transition-group
      tag="ul"
      name="task-list-anim"
      class="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden shadow"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @leave="onLeave"
      :appear="true"
    >
      <TaskItem
        :key="task._id"
        v-for="(task, index) in tasks"
        :task="task"
        :data-index="index"
        @task-updated="(item) => $emit('task-updated', item)"
        @task-deleted="(taskId) => $emit('task-deleted', taskId)"
        class="task-list-item"
      />
    </transition-group>
    <p
      v-if="tasks.length === 0 && !$store.state.isLoading"
      class="text-center text-gray-500 dark:text-gray-400 py-6"
    >
      No tasks yet. Add one above!
    </p>
  </div>
</template>

<script>
import TaskItem from "./TaskItem.vue";
import { animate } from "animejs";

export default {
  components: {
    TaskItem,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
  },
  computed: {},
  methods: {
    onBeforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = "translateY(30px) scale(0.9)";
    },
    onEnter(el, done) {
      // Animation for new tasks and initial task rendering
      const delay = el.dataset.index * 75; // Stagger delay based on index
      animate(el, {
        opacity: [0, 1],
        translateY: ["30px", 0],
        scale: [0.9, 1],
        duration: 600,
        delay: delay,
        easing: "easeOutExpo",
        complete: done,
      });
    },
    onLeave(el, done) {
      const delay = el.dataset.index * 50;

      animate(el, {
        opacity: [1, 0],
        translateY: [0, "-30px"],
        scale: [1, 0.95],
        duration: 400,
        delay: delay,
        easing: "easeInExpo",
        complete: done,
      });
    },
  },
};
</script>

<style></style>
