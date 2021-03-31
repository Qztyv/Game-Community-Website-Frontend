<template>
  <h3>User Settings</h3>
  <div id="side_nav">
    <router-link to="/settings/account">Account</router-link> |
    <router-link to="/settings/profile">Profile</router-link>
    <div id="admin_extra" v-if="user.role === 'admin'">
      | <router-link to="/settings/manage-users">Manage Users</router-link> |
      <router-link to="/settings/manage-posts">Manage Posts</router-link> |
      <router-link to="/settings/manage-tournaments"
        >Manage Tournaments</router-link
      >
    </div>
  </div>
  <router-view></router-view>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    console.log(user.value);

    return {
      user,
    };
  },
};
</script>

<style></style>
