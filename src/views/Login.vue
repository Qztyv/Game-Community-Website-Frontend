<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <form @submit.prevent="loginUser">
    <label for="email">Enter your email here:</label>
    <input
      type="email"
      id="email"
      placeholder="Email e.g: Qzty@gmail.com"
      v-model="email"
      required
    />
    <label for="password"
      >Enter your password here (8 characters minimum)</label
    >
    <input
      type="password"
      id="password"
      placeholder="********"
      v-model="password"
      minlength="8"
      required
    />
    <button type="submit">Log In</button>
  </form>
  <router-link to="/signup">Dont have an account? Sign up here!</router-link>
  <router-link to="/forgot-password"
    >Forgot your password? Reset it here!</router-link
  >
</template>

<script>
import AuthService from "@/services/AuthService.js";
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    const email = ref(null);
    const password = ref(null);
    let response = ref(null);
    let timeout = null;

    const loginUser = async () => {
      response.value = await AuthService.login({
        email: email.value,
        password: password.value,
      });
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Logged-in successfully! Redirecting...",
        });
        // Store token. Note, we also need to update the apiClient axios object in the service.
        store.dispatch("storeToken", response.value.token);
        store.dispatch("storeUser", response.value.data.user);
        timeout = setTimeout(() => {
          router.push({ name: "Home" });
        }, 1500);
      }
    };

    // If the user leaves before redirect
    onBeforeUnmount(() => {
      clearTimeout(timeout);
    });

    return {
      email,
      password,
      response,
      loginUser,
      timeout,
    };
  },
};
</script>

<style></style>
