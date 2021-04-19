<template>
  <PageBanner>
    <template v-slot:title>Account Settings</template>
    <template v-slot:description
      >All settings regarding your account can be found here</template
    >
  </PageBanner>
  <div class="account-settings">
    <div v-if="response?.message" class="white-text card-panel red">
      <span>{{ response.message }}</span>
    </div>
    <h5 class="white-text card-panel blue-grey darken-1">Account Details</h5>
    <form @submit.prevent="updateAccount">
      <div class="input-wrapper">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="email"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <label for="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          v-model="name"
          minlength="4"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <img
          :src="
            previewImage
              ? previewImage
              : require('@/assets/default_profile_image.png')
          "
          alt="Profile Photo"
          width="50"
          height="50"
          class="profile-image"
        />

        <label for="photo">Select a New Photo:</label>
        <input
          type="file"
          @change="onFileChange"
          accept="image/*"
          id="photo"
          name="photo"
        />
      </div>
      <button
        type="submit"
        class="waves-effect waves-light btn-small blue-grey lighten-1"
      >
        Update Details
      </button>
    </form>
    <h5 class="white-text card-panel blue-grey darken-1">Password Change</h5>
    <form @submit.prevent="updatePassword">
      <div class="input-wrapper">
        <label for="currentPassword">Current Password</label>
        <input
          type="password"
          id="currentPassword"
          placeholder="********"
          v-model="currentPassword"
          minlength="8"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <label for="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          placeholder="********"
          v-model="newPassword"
          minlength="8"
          class="validate"
          required
        />
      </div>
      <div class="input-wrapper">
        <label for="newPasswordConfirmation">Re-enter New Password</label>
        <input
          type="password"
          id="newPasswordConfirmation"
          placeholder="********"
          v-model="passwordConfirm"
          minlength="8"
          class="validate"
          required
        />
      </div>
      <button
        type="submit"
        class="waves-effect waves-light btn-small blue-grey lighten-1"
      >
        Update Password
      </button>
    </form>
    <h5 class="white-text card-panel blue-grey darken-1">Deactivate Account</h5>
    <div class="delete-button">
      <ConfirmationBox
        @deleteDocument="deactivateAccount"
        uniqueKey="account-deactivate"
      >
        <template v-slot:button-text>Deactivate Account</template>
        <template v-slot:button-popup-text
          >Are you sure you want to deactivate your account? You will not be
          able to reactivate the account once this action is done. Also note
          that deactivating your account does not delete posts and comments; if
          you wish for these to be deleted, go through and manually delete them
          before deactivating.</template
        >
      </ConfirmationBox>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService.js";
import logoutUser from "@/utils/logoutUser.js";
import PageBanner from "@/components/PageBanner";
import ConfirmationBox from "@/components/ConfirmationBox";

export default {
  components: {
    PageBanner,
    ConfirmationBox,
  },
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
      form.append("photo", file.value);
      response.value = await AuthService.updateAccount(form);
      if (response.value.status === "success") {
        store.dispatch("addNotification", {
          type: "success",
          message: "Details Updated Successfully!",
        });
        store.dispatch("storeUser", response.value.data.user);
        if (fileObject?.target) fileObject.target.value = "";
      }
    };

    let fileObject = null;
    const previewImage = ref(user.value.photo);
    const onFileChange = (e) => {
      if (e.target.files[0]) {
        file.value = e.target.files[0];
        fileObject = e;
        if (file.value) {
          // preview the image before upload
          previewImage.value = URL.createObjectURL(file.value);
        }
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
      previewImage,
      onFileChange,
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

<style scoped>
.account-settings {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 50%;
  position: relative;
  border-radius: 4px;
  background-color: #ffffff;
  text-align: left;
}
@media only screen and (max-width: 992px) {
  .account-settings {
    width: 80%;
  }
}

form {
  width: 80%;
}

.card-panel {
  padding: 12px;
  border-radius: 0px;
}

.delete-button {
  padding: 18px;
}
</style>
