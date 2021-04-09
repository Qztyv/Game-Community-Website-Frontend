<template>
  <div id="nav" v-if="!Object.keys(user).length">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Log In</router-link> |
    <router-link to="/signup">Sign Up</router-link>
  </div>
  <div id="nav" v-else>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/settings">Settings</router-link> |
    <a href="#" @click="logout">Log Out</a> |
    <router-link :to="{ name: 'UserProfile', params: { userId: user._id } }">
      <img
        :src="user.photo"
        alt="Profile Photo"
        width="50"
        height="50"
      />Profile
    </router-link>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import logoutUser from "@/utils/logoutUser.js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.user);

    const logout = async () => {
      await logoutUser(store, router);
    };
    return {
      user,
      logout,
    };
  },
};
</script>

<style></style>
