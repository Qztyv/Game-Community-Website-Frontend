import axios from "axios";
import store from "@/store/index.js";

const apiClient = axios.create({
  //baseURL: "https://game-community-website-backend.herokuapp.com/api/v1/", // for deployment
  baseURL: "http://127.0.0.1:3000/api/v1/", // for local development
  timeout: 15 * 1000,
  withCredentials: true,
  headers: { "X-Forwarded-Proto": "https" },
});

// Due to cross-site tracking of some browsers (Safari) and hardware (iOS),
// cookies sent from the backend are blocked since they are "third-party"
// using a bearer token in the Authorization will 100% work instead.
const token = `Bearer ${store.state.token}`;

// We set authorization here for the scenario of when a user closes their browser and reopens it.
// When apiClient is created it will attach any existing token in vuex persisted localStorage
apiClient.defaults.headers.common["Authorization"] = token;

export default apiClient;
