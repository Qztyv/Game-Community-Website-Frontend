<template>
  <div class="notification" :class="notificationType" id="flashMessage">
    {{ notification.message }}
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useStore } from "vuex";
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    let timeout = null;

    const notificationType = computed(
      () => `notification--${props.notification.type}`
    );

    function removeNotification() {
      store.dispatch("deleteNotification", props.notification);
    }

    onMounted(() => {
      timeout = setTimeout(() => {
        removeNotification();
      }, 1500);
    });

    onBeforeUnmount(() => {
      clearTimeout(timeout);
    });

    return {
      notificationType,
      timeout,
    };
  },
};
</script>

<style scoped>
/* @keyframes yellowfade {
  from {
    background: yellow;
  }
  to {
    background: transparent;
  }
}

#flashMessage {
  animation-name: yellowfade;
  animation-duration: 1.5s;
} */

.notification {
  position: fixed;
  top: 0;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 9999;
  color: #fff;
  font-size: 1.8rem;
  font-weight: 400;
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 1.6rem 2rem;
  -webkit-box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.25);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.25);
}
.notification--success {
  background-color: #20bf6b;
}
.notification--error {
  background-color: #eb4d4b;
}
</style>
