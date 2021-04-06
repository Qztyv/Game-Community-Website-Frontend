import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js"; // results in tight coupling between vuex and router, but sufficient for this project
import Home from "../views/Home.vue";
import Signup from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import Settings from "@/views/Settings.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import Account from "@/views/nested_views/Account.vue";
import Profile from "@/views/nested_views/Profile.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import PostSection from "@/views/PostSection.vue";
import UserProfile from "@/views/UserProfile.vue";

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
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    beforeEnter: loggedOutUsersOnly,
  },
  {
    path: "/reset-password/:resetToken",
    name: "ResetPassword",
    component: ResetPassword,
    props: true,
    beforeEnter: loggedOutUsersOnly,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    beforeEnter: requireAuth,
    children: [
      {
        path: "account",
        component: Account,
      },
      {
        path: "profile",
        component: Profile,
      },
      {
        path: "",
        component: Account,
      },
    ],
  },
  {
    path: "/post/:id",
    name: "PostSection",
    component: PostSection,
    props: true,
  },
  {
    path: "/user/:userId",
    name: "UserProfile",
    component: UserProfile,
    props: true,
    children: [
      {
        path: "posts",
        name: "UserPosts",
        component: Home,
      },
      {
        path: ":comments",
        component: Profile,
      },
      {
        path: "",
        component: Home,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
