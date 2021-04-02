import store from "@/store/index.js";
import router from "@/router/index.js";

const handleServiceErrors = (err) => {
  let error;
  if (err.response) {
    error = err.response.data;
    logoutUserIfCookieHasExpired(error);
  } else if (err.request) {
    error = {
      status: "error",
      message:
        "No response received from the server, check your internet connection and try again.",
    };
  } else {
    error = {
      status: "error",
      message: "Error when creating request to send to the server.",
    };
  }
  return error;
};

const logoutUserIfCookieHasExpired = (error) => {
  if (error.message.startsWith("You are not logged in!")) {
    store.dispatch("logoutUser");
    router.push({ name: "Login" });
    store.dispatch("addNotification", {
      type: "error",
      message: error.message,
    });
  }
};
export default handleServiceErrors;
