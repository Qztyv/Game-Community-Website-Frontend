import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

let nextNotificationId = 0;
const store = createStore({
  plugins: [createPersistedState()],
  state: {
    notifications: [],
    user: {},
  },
  mutations: {
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        ...notification,
        id: nextNotificationId++,
      });
    },
    DELETE_NOTIFICATION(state, notification) {
      state.notifications = state.notifications.filter(
        (el) => el.id !== notification.id
      );
    },
    STORE_LOGGED_IN_USER(state, user) {
      state.user = user;
    },
    LOGOUT_USER(state) {
      state.user = {};
    },
  },
  actions: {
    addNotification({ commit }, notification) {
      commit("ADD_NOTIFICATION", notification);
    },
    deleteNotification({ commit }, notification) {
      commit("DELETE_NOTIFICATION", notification);
    },
    storeLoggedInUser({ commit }, user) {
      commit("STORE_LOGGED_IN_USER", user);
    },
    logoutUser({ commit }) {
      commit("LOGOUT_USER");
    },
  },
  modules: {},
});

export default store;
