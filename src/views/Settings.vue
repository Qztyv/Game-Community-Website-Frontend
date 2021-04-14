<template>
  <h2>Account Settings</h2>
  <div v-if="response">
    {{ response.message }}
  </div>
  <h3>Account Details</h3>
  <form @submit.prevent="updateAccount">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" v-model="email" required />
    <label for="name">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      v-model="name"
      minlength="4"
      required
    />
    <img :src="user.photo" alt="Profile Photo" width="50" height="50" />
    <label for="photo">Select a new photo</label>
    <input
      type="file"
      @change="file = $event"
      accept="image/*"
      id="photo"
      name="photo"
    />
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
    let file = ref("");

    let response = ref(null);

    const updateAccount = async () => {
      // Need to create a multi-part form since part of the form contains an image that
      // we are sending. If we dont do this then the image is ignored.
      const form = new FormData();
      form.append("name", name.value);
      form.append("email", email.value);
      form.append("photo", file.value.target?.files[0]);
      response.value = await AuthService.updateAccount(form);
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Details Updated Successfully!",
        });
        store.dispatch("storeUser", response.value.data.user);
        if (file.value.target) file.value.target.value = "";
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
      user,
      email,
      name,
      file,
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
