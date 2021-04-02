import apiClient from "./apiClient";
import handleServiceErrors from "./../utils/handleServiceErrors";

export default {
  async signup(signupForm) {
    let response;
    try {
      response = await apiClient.post("users/signup", signupForm);
      response = response.data;
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
