<template>
  <PageBanner>
    <template v-slot:title>Reset Password</template>
    <template v-slot:description>
      Enter a new password to regain access to your account!
    </template>
  </PageBanner>
  <form @submit.prevent="resetPassword">
    <div v-if="response?.message" class="white-text card-panel red">
      {{ response.message }}
    </div>
    <div class="card-panel">
      <div class="input-wrapper">
        <label for="password"
          >Enter a new password here (8 characters minimum)</label
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
        <label for="passwordConfirmation">Re-enter your password here</label>
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
        Update Password
      </button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";
import PageBanner from "@/components/PageBanner.vue";
export default {
  components: {
    PageBanner,
  },
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
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Password Successfully Reset! Redirecting...",
        });
        // Store token. Note, we also need to update the apiClient axios object in the service.
        store.dispatch("storeToken", response.value.token);
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
