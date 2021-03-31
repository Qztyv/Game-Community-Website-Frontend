import AuthService from "@/services/AuthService.js";

const logoutUser = async (store, router) => {
  let response = await AuthService.logout();
  if (response.status === "error") {
    store.dispatch("addNotification", {
      type: "error",
      message: "Logout failed: " + response.message,
    });
  } else {
    store.dispatch("logoutUser"); // should remove from memory and peristant storage
    router.push({ name: "Login" });
  }
};

export default logoutUser;
