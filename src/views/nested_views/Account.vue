<template>
  <h2>Account Settings</h2>
  <div v-if="response">
    {{ response.message }}
  </div>
  <h3>Account Details</h3>
  <form @submit.prevent="updateAccount">
    <label for="email">Email</label>
    <input type="email" id="email" v-model="email" required />
    <label for="name">Name</label>
    <input type="text" id="name" v-model="name" minlength="4" required />
    <button type="submit">Update Details</button>
  </form>
  <h3>Password Change</h3>
  <form @submit.prevent="updatePassword">
    <label for="currentPassword">Current Password</label>
    <input
      type="password"
      id="currentPassword"
      placeholder="********"
      v-model="currentPassword"
      minlength="8"
      required
    />
    <label for="newPassword">New Password</label>
    <input
      type="password"
      id="newPassword"
      placeholder="********"
      v-model="newPassword"
      minlength="8"
      required
    />
    <label for="newPasswordConfirmation">Re-enter New Password</label>
    <input
      type="password"
      id="newPasswordConfirmation"
      placeholder="********"
      v-model="passwordConfirm"
      minlength="8"
      required
    />
    <button type="submit">Update Password</button>
  </form>
  <h3>Deactivate Account</h3>
  <form @submit.prevent="deactivateAccount">
    <button type="submit">Deactivate Account</button>
  </form>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";
import logoutUser from "@/utils/logoutUser.js";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.user);
    let email = ref(user.value.email);
    let name = ref(user.value.name);

    let response = ref(null);

    const updateAccount = async () => {
      response.value = await AuthService.updateAccount({
        email: email.value,
        name: name.value,
      });
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Details Updated Successfully!",
        });
        store.dispatch("storeUser", response.value.data.user);
      }
    };

    const currentPassword = ref(null);
    const newPassword = ref(null);
    const passwordConfirm = ref(null);

    const updatePassword = async () => {
      response.value = await AuthService.updatePassword({
        currentPassword: currentPassword.value,
        password: newPassword.value,
        passwordConfirm: passwordConfirm.value,
      });
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Password Changed Successfully!",
        });
        store.dispatch("storeUser", response.value.data.user);
        currentPassword.value = null;
        newPassword.value = null;
        passwordConfirm.value = null;
      }
    };

    let timeout = null;

    const deactivateAccount = async () => {
      response.value = await AuthService.deactivateAccount();
      console.log(response.value);
      if (response.value.status === 204) {
        store.dispatch("addNotification", {
          type: "success",
          message: "Account Deactivated, Goodbye :(",
        });
        timeout = setTimeout(async () => {
          await logoutUser(store, router);
        }, 1500);
      }
    };

    return {
      email,
      name,
      updateAccount,
      response,
      currentPassword,
      newPassword,
      passwordConfirm,
      updatePassword,
      deactivateAccount,
      timeout,
    };
  },
};
</script>

<style></style>
