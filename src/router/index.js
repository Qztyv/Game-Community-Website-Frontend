import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js"; // results in tight coupling between vuex and router, but sufficient for this project
import Home from "../views/Home.vue";
import Signup from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import AccountSettings from "@/views/AccountSettings.vue";

const requireAuth = (to, from, next) => {
  if (!Object.keys(store.state.user).length) {
    return next({ name: "Login" });
  }

  next();
};

const loggedOutUsersOnly = (to, from, next) => {
  if (Object.keys(store.state.user).length) {
    return next({ name: "Home" });
  }

  next();
};

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    beforeEnter: loggedOutUsersOnly,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: loggedOutUsersOnly,
  },
  {
    path: "/account-settings",
    name: "AccountSettings",
    component: AccountSettings,
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
