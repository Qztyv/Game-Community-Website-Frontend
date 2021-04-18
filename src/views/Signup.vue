<template>
  <PageBanner>
    <template v-slot:title>Register Page</template>
    <template v-slot:description>
      Create an account so you can interact with the community!
    </template>
  </PageBanner>
  <form @submit.prevent="signupUser">
    <div v-if="response?.message" class="white-text card-panel red">
      <span>{{ response.message }}</span>
    </div>
    <div class="card-panel">
      <div class="input-wrapper">
        <label for="name">Enter your display name here:</label>
        <input
          type="text"
          id="name"
          placeholder="display name"
          v-model="name"
          minlength="4"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <label for="email">Enter your email here:</label>
        <input
          type="email"
          id="email"
          placeholder="email"
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
          minlength="8"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <label for="passwordConfirmation"
          >Re-enter your password here (8 characters minimum)</label
        >
        <input
          type="password"
          id="passwordConfirmation"
          placeholder="********"
          v-model="passwordConfirm"
          minlength="8"
          class="validate"
          required
        />
      </div>
      <button
        type="submit"
        class="waves-effect waves-light btn-small green darken-1"
      >
        Sign Up
      </button>
    </div>
  </form>
  <router-link to="/login">Have an account? Log in here</router-link>
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

    const name = ref(null);
    const email = ref(null);
    const password = ref(null);
    const passwordConfirm = ref(null);
    let response = ref(null);
    let timeout = null;

    const signupUser = async () => {
      response.value = await AuthService.signup({
        name: name.value,
        email: email.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      });
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Signed-up successfully! Redirecting...",
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
      name,
      email,
      password,
      passwordConfirm,
      response,
      signupUser,
      timeout,
    };
  },
};
</script>

<style></style>
