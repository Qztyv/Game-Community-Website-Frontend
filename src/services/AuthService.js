import axios from "axios";

const apiClient = axios.create({
  //baseURL: "https://game-community-website-backend.herokuapp.com/api/v1/",
  baseURL: "http://127.0.0.1:3000/api/v1/",
  timeout: 15 * 1000,
  withCredentials: true,
});

export default {
  async signup(signupForm) {
    let response;
    try {
      response = await apiClient.post("users/signup", signupForm);
      response = response.data;
    } catch (err) {
      response = handleRequestResponseErrors(err);
    }
    return response;
  },
  async login(loginForm) {
    let response;
    try {
      response = await apiClient.post("users/login", loginForm);
      response = response.data;
    } catch (err) {
      response = handleRequestResponseErrors(err);
    }
    return response;
  },
  async logout() {
    let response;
    try {
      response = await apiClient.get("users/logout");
      response = response.data;
    } catch (err) {
      response = handleRequestResponseErrors(err);
    }
    return response;
  },
};

const handleRequestResponseErrors = (err) => {
  let response;
  if (err.response) {
    response = err.response.data;
  } else if (err.request) {
    response = {
      status: "error",
      message:
        "No response received from the server, check your internet connection and try again.",
    };
  } else {
    response = {
      status: "error",
      message: "Error when creating request to send to the server.",
    };
  }
  return response;
};
