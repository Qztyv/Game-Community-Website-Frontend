<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <form @submit.prevent="resetPassword">
    <label for="password"
      >Enter a new password here (8 characters minimum)</label
    >
    <input
      type="password"
      id="password"
      placeholder="********"
      v-model="password"
      minlength="8"
      required
    />
    <label for="passwordConfirmation">Re-enter your password here</label>
    <input
      type="password"
      id="passwordConfirmation"
      placeholder="********"
      v-model="passwordConfirm"
      minlength="8"
      required
    />
    <button type="submit">Update Password</button>
  </form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";

export default {
  props: {
    resetToken: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const password = ref(null);
    const passwordConfirm = ref(null);

    const response = ref(null);
    let timeout = null;
    const resetPassword = async () => {
      response.value = await AuthService.resetPassword(props.resetToken, {
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      });
      console.log(response.value);
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Password Successfully Reset! Redirecting...",
        });
        store.dispatch("storeUser", response.value.data.user);
        timeout = setTimeout(() => {
          router.push({ name: "Home" });
        }, 1500);
      }
    };

    return {
      password,
      passwordConfirm,
      resetPassword,
      response,
      timeout,
    };
  },
};
</script>

<style></style>
