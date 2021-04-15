import apiClient from "./apiClient";
import handleServiceErrors from "./../utils/handleServiceErrors";

export default {
  async signup(signupForm) {
    let response;
    try {
      response = await apiClient.post("users/signup", signupForm);
      response = response.data;
      if (response.status === "success") {
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
      }
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async login(loginForm) {
    let response;
    try {
      response = await apiClient.post("users/login", loginForm);
      response = response.data;
      // If login is a success, we need to set the existing apiClient object authorization
      // header to the appropriate bearer token. If the user closes their browser after this,
      // the token will be set again in the apiClient.js using the stored token in vuex.
      if (response.status === "success") {
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
      }
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async logout() {
    let response;
    try {
      response = await apiClient.get("users/logout");
      response = response.data;
      // we are sending a logout to the server so we can get back a cookie that wipes our
      // cookie content (since we cant change it here due to httponly cookie property.)
      // However, we also are using bearer tokens due to cross-site tracking protection stopping
      // our third-party cookie from being used as persistence. Because of this, we also wipe
      // the authorization header on logout, irregardless of whether the server response fails.
      apiClient.defaults.headers.common["Authorization"] = "";
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async forgotPassword(forgotPasswordForm) {
    let response;
    try {
      response = await apiClient.post(
        "users/forgotPassword",
        forgotPasswordForm
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async resetPassword(resetToken, resetPasswordForm) {
    let response;
    try {
      response = await apiClient.patch(
        `users/resetPassword/${resetToken}`,
        resetPasswordForm
      );
      response = response.data;
      if (response.status === "success") {
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.token}`;
      }
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async updateAccount(updateAccountForm) {
    let response;
    try {
      response = await apiClient.patch("users/updateMe", updateAccountForm);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async updatePassword(updatePasswordForm) {
    let response;
    try {
      response = await apiClient.patch(
        "users/updateMyPassword",
        updatePasswordForm
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async deactivateAccount() {
    let response;
    try {
      response = await apiClient.delete("users/deleteMe");
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
};
