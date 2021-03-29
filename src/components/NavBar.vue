<template>
  <div id="nav" v-if="!Object.keys(user).length">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/signup">Signup</router-link>
  </div>
  <div id="nav" v-if="Object.keys(user).length">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/account-settings">Account Settings</router-link> |
    <a href="#" @click="logoutUser">Logout</a>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => store.state.user);

    const logoutUser = async () => {
      let response = await AuthService.logout();
      if (response.status === "error") {
        store.dispatch("addNotification", {
          type: "error",
          message: "Logout failed: " + response.message,
        });
      } else {
        store.dispatch("logoutUser"); // should remove from memory and peristant storage
        router.push({ name: "Login" });
      }
    };
    return {
      user,
      logoutUser,
    };
  },
};
</script>

<style></style>
