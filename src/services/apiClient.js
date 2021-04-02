import axios from "axios";

const apiClient = axios.create({
  //baseURL: "https://game-community-website-backend.herokuapp.com/api/v1/",
  baseURL: "http://127.0.0.1:3000/api/v1/",
  timeout: 15 * 1000,
  withCredentials: true,
  headers: { "X-Forwarded-Proto": "https" },
});

export default apiClient;
