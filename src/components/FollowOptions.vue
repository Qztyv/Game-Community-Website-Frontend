<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="response">
      {{ response.message }}
    </div>
    <div v-if="!isFollowing">
      <button @click="addFollowing">Follow</button>
    </div>
    <div v-else>
      <button @click="removeFollowing">Unfollow</button>
    </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import ProfileService from "./../services/ProfileService.js";

export default {
  props: {
    profileUserId: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const hasComponentInitiallyLoaded = ref(false);

    const store = useStore();
    const loggedInUser = computed(() => store.state.user);

    const isFollowing = ref(null);

    // Get fresh value of following array incase the user has used another device since,
    // in these scenarios we cannot rely on local storage of the browser.
    // There is too many edge cases to consider when using vuex for storing these things, just
    // to simply save calls to the database - it isnt worth it for now atleast.
    onBeforeMount(async () => {
      let response = await ProfileService.getUserFollowing(
        loggedInUser.value._id
      );
      // returns logged in users following
      let following = [];
      if (response.status === "success" && response.data.data.length) {
        following = response.data.data[0].following;
      }
      // compare logged in users following to the userId of the profile to see whether
      // they are already following or not - this determines the follow/unfollow functionality button
      isFollowing.value = following.some(
        (userEl) => userEl._id === props.profileUserId
      );
      hasComponentInitiallyLoaded.value = true;
    });

    const response = ref(null);
    const addFollowing = async () => {
      response.value = await ProfileService.addFollowingToLoggedInUser(
        props.profileUserId
      );
      if (response.value.status === "success") {
        isFollowing.value = true;
        context.emit("incrementFollowerCounter");
      }
    };
    const removeFollowing = async () => {
      response.value = await ProfileService.removeFollowingFromLoggedInUser(
        props.profileUserId
      );
      if (response.value.status === 204) {
        isFollowing.value = false;
        context.emit("decrementFollowerCounter");
      }
    };
    return {
      hasComponentInitiallyLoaded,
      isFollowing,
      response,
      addFollowing,
      removeFollowing,
    };
  },
};
</script>

<style></style>
