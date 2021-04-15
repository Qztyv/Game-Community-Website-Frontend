import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js"; // results in tight coupling between vuex and router, but sufficient for this project
import Home from "../views/Home.vue";
import Signup from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import Settings from "@/views/Settings.vue";
import PageNotFound from "@/views/PageNotFound.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import PostSection from "@/views/PostSection.vue";
import UserProfile from "@/views/UserProfile.vue";
import UserPosts from "@/views/nested_views/UserPosts.vue";
import UserComments from "@/views/nested_views/UserComments.vue";
import FollowingPosts from "@/views/FollowingPosts.vue";
import UserFollowers from "@/views/nested_views/UserFollowers.vue";
import UserFollowing from "@/views/nested_views/UserFollowing.vue";
import CreatePost from "@/views/CreatePost.vue";
import UpdatePost from "@/views/UpdatePost.vue";

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
    path: "/following-feed",
    name: "FollowingPosts",
    component: FollowingPosts,
    beforeEnter: requireAuth,
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
  },
  {
    path: "/post/:id",
    name: "PostSection",
    component: PostSection,
    props: true,
  },
  {
    path: "/post/create",
    name: "CreatePost",
    component: CreatePost,
    beforeEnter: requireAuth,
  },
  {
    path: "/post/:id/update",
    name: "UpdatePost",
    component: UpdatePost,
    beforeEnter: requireAuth,
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
        component: UserPosts,
      },
      {
        path: "comments",
        name: "UserComments",
        component: UserComments,
      },
      {
        path: "followers",
        name: "UserFollowers",
        component: UserFollowers,
      },
      {
        path: "following",
        name: "UserFollowing",
        component: UserFollowing,
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
