<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <form @submit.prevent="signupUser">
    <label for="name"
      >Enter your website name alias here (4 characters minimum):</label
    >
    <input
      type="text"
      id="name"
      placeholder="Name alias here, e.g: Qzty"
      v-model="name"
      minlength="4"
      required
    />
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
    <label for="passwordConfirmation"
      >Re-enter your password here (8 characters minimum)</label
    >
    <input
      type="password"
      id="passwordConfirmation"
      placeholder="********"
      v-model="passwordConfirm"
      minlength="8"
      required
    />
    <button type="submit">Signup</button>
  </form>
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
        store.dispatch("storeLoggedInUser", response.value.data.user);
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
