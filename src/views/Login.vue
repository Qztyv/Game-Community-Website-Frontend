<template>
  <PageBanner>
    <template v-slot:title>Login Page</template>
    <template v-slot:description>
      Login here to access your account and following feed!
    </template>
  </PageBanner>
  <form @submit.prevent="loginUser">
    <div v-if="response?.message" class="white-text card-panel red">
      <span>{{ response.message }}</span>
    </div>
    <div class="card-panel">
      <div class="input-wrapper">
        <label for="email">Enter your email here:</label>
        <input
          type="email"
          id="email"
          placeholder="Email e.g: Qzty@gmail.com"
          v-model="email"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <label for="password"
          >Enter your password here (8 characters minimum)</label
        >
        <input
          type="password"
          id="password"
          placeholder="********"
          v-model="password"
          class="validate"
          minlength="8"
          required
        />
      </div>
      <button
        type="submit"
        class="waves-effect waves-light btn-small blue-grey lighten-1"
      >
        Log In
      </button>
    </div>
  </form>
  <div class="button">
    <router-link to="/signup">Dont have an account? Sign up here!</router-link>
  </div>
  <div class="button">
    <router-link to="/forgot-password"
      >Forgot your password? Reset it here!</router-link
    >
  </div>
</template>

<script>
import AuthService from "@/services/AuthService.js";
import { onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import PageBanner from "@/components/PageBanner.vue";

export default {
  components: {
    PageBanner,
  },
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

<style scoped>
.button {
  padding-bottom: 10px;
}
</style>
