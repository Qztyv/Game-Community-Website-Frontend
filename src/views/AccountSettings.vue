<template>
  <h1>Account Settings Page</h1>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    console.log(user.value);
  },
};
</script>

<style></style>
