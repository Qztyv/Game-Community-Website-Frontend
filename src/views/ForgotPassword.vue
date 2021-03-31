<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <form @submit.prevent="forgotPassword">
    <label for="email">Email of account</label>
    <input
      type="email"
      id="email"
      placeholder="Email e.g: Qzty@gmail.com"
      v-model="email"
      required
    />
    <button type="submit">Reset Password</button>
  </form>
</template>

<script>
import { ref } from "vue";
import AuthService from "@/services/AuthService.js";
export default {
  setup() {
    const email = ref(null);
    const response = ref(null);

    const forgotPassword = async () => {
      response.value = await AuthService.forgotPassword({ email: email.value });
      console.log(response.value);
      if (response.value.status === "success") {
        // change response div to green, else show red
      }
    };

    return {
      email,
      response,
      forgotPassword,
    };
  },
};
</script>

<style></style>
