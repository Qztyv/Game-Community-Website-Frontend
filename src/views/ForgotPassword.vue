<template>
  <PageBanner>
    <template v-slot:title>Forgot Password?</template>
    <template v-slot:description>
      Enter your email here to be sent a one-time link to reset your password
      (valid for 10 minutes only)
    </template>
  </PageBanner>
  <form @submit.prevent="forgotPassword">
    <div
      v-if="response"
      class="white-text card-panel"
      v-bind:class="{ green: wasSuccessful, red: !wasSuccessful }"
    >
      {{ response.message }}
    </div>
    <div class="card-panel">
      <div class="input-wrapper">
        <label for="email">Email of account</label>
        <input
          type="email"
          id="email"
          placeholder="Email e.g: Qzty@gmail.com"
          v-model="email"
          class="validate"
          required
        />
      </div>
      <button
        type="submit"
        class="waves-effect waves-light btn-small red lighten-2"
      >
        Reset Password
      </button>
    </div>
  </form>
  <router-link to="/login">Back to Login</router-link>
</template>

<script>
import { ref } from "vue";
import AuthService from "@/services/AuthService.js";
import PageBanner from "@/components/PageBanner.vue";
export default {
  components: {
    PageBanner,
  },
  setup() {
    const email = ref(null);
    const response = ref(null);

    const wasSuccessful = ref(null);

    const forgotPassword = async () => {
      response.value = await AuthService.forgotPassword({ email: email.value });
      if (response.value.status === "success") {
        wasSuccessful.value = true;
      } else {
        wasSuccessful.value = false;
      }
    };

    return {
      email,
      response,
      forgotPassword,
      wasSuccessful,
    };
  },
};
</script>

<style></style>
