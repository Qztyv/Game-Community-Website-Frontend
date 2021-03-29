<template>
  <div class="notificaton-container">
    <Notification
      v-for="notification in globalNotifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  components: {
    Notification,
  },
  setup() {
    const store = useStore();
    const globalNotifications = computed(() => store.state.notifications);

    return {
      globalNotifications,
    };
  },
};
</script>

<style></style>
