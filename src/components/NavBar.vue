<template>
  <div v-show="!Object.keys(user).length" class="non-user">
    <div class="navbar-fixed">
      <nav class="blue-grey darken-2 noSelect">
        <div class="nav-wrapper">
          <a href="#" class="noSelect brand-logo">Gaming Hub</a>
          <a href="#" data-target="mobile-demo-nonuser" class="sidenav-trigger">
            <i class="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <NonUserNavBarList />
          </ul>
        </div>
      </nav>
    </div>
    <ul class="sidenav" id="mobile-demo-nonuser">
      <NonUserNavBarList />
    </ul>
  </div>
  <div class="user-items" v-show="Object.keys(user).length">
    <div class="navbar-fixed">
      <nav class="blue-grey darken-2 noSelect">
        <div class="nav-wrapper">
          <a href="#" class="noSelect brand-logo">Gaming Hub</a>
          <a href="#" data-target="mobile-demo-user" class="sidenav-trigger">
            <i class="material-icons">menu</i>
          </a>
          <ul id="nav-mobile" class="right hide-on-med-and-down">
            <UserNavBarList @logoutUser="logout" />
          </ul>
        </div>
      </nav>
    </div>
    <ul class="sidenav" id="mobile-demo-user">
      <UserNavBarList @logoutUser="logout" :mergeFeedsIntoDropdown="false" />
    </ul>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import logoutUser from "@/utils/logoutUser.js";
import NonUserNavBarList from "@/components/NonUserNavBarList";
import UserNavBarList from "@/components/UserNavBarList";
export default {
  components: {
    NonUserNavBarList,
    UserNavBarList,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.user);

    const logout = async () => {
      await logoutUser(store, router);
    };
    return {
      user,
      logout,
    };
  },
};
</script>

<style scoped>
@media only screen and (min-width: 993px) {
  .brand-logo {
    left: 0.5rem;
  }
}

@media only screen and (max-width: 565px) {
  .brand-logo {
    width: 500px;
  }
}

.user-items {
  display: flex;
}

.non-user {
  display: flex;
}

.logout {
  margin-right: 8px;
  cursor: pointer;
}

.sidenav {
  text-align: left;
}

.user-items {
  padding-bottom: 10px;
}
.non-user {
  padding-bottom: 10px;
}
</style>
