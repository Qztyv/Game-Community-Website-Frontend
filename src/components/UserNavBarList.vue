<template>
  <li>
    <router-link to="/post/create"
      ><i class="material-icons right">add</i>Create A Post</router-link
    >
  </li>
  <li v-if="!mergeFeedsIntoDropdown">
    <router-link to="/"
      ><i class="material-icons right">public</i>All</router-link
    >
  </li>
  <li v-if="!mergeFeedsIntoDropdown">
    <router-link to="/following-feed"
      ><i class="material-icons right">groups</i>Following</router-link
    >
  </li>
  <li v-if="mergeFeedsIntoDropdown">
    <a class="dropdown-trigger" href="#" data-target="feed-dropdown"
      ><i class="material-icons right">forum</i>Feeds
    </a>
  </li>
  <li>
    <router-link to="/settings"
      ><i class="material-icons right">settings</i>Settings</router-link
    >
  </li>
  <li class="logout" @click="$emit('logoutUser')">
    <router-link to="/login">
      <i class="material-icons right">exit_to_app</i>
      Logout
    </router-link>
  </li>
  <li>
    <router-link :to="{ name: 'UserProfile', params: { userId: user._id } }">
      Profile
      <div class="profile-image-container">
        <img
          :src="user.photo"
          alt="Profile Photo"
          width="50"
          height="50"
          class="profile-image"
        />
      </div>
    </router-link>
  </li>

  <!-- feed-dropdown - id. This links to one of the list elements with mergeFeedsIntoDropdown = true.<template>
    This is important, as when that list button is clicked, this dropdown list comes up with options.
    When the browser shrinks to a small enough size, mergeFeedsIntoDropdown = false, meaning  -->
  <ul
    id="feed-dropdown"
    class="dropdown-content blue-grey lighten-2"
    v-if="mergeFeedsIntoDropdown"
  >
    <li>
      <router-link to="/"
        ><i class="material-icons right white-text">public</i>
        <p class="white-text">All</p></router-link
      >
    </li>
    <li>
      <router-link to="/following-feed"
        ><i class="material-icons right white-text">groups</i>
        <p class="white-text">Following</p></router-link
      >
    </li>
  </ul>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  emits: ["logoutUser"],
  props: {
    mergeFeedsIntoDropdown: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.user);

    return {
      user,
    };
  },
};
</script>

<style scoped>
.profile-image-container {
  float: right;
  padding-left: 10px;
  margin-top: 5px;
}
</style>
