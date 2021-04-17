<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="response?.message" class="white-text card-panel red">
      <span>{{ response.message }}</span>
    </div>
    <div v-if="!isFollowing">
      <button
        @click="addFollowing"
        class="waves-effect waves-light btn-small blue-grey lighten-1"
      >
        Follow
      </button>
    </div>
    <div v-else>
      <button
        @click="removeFollowing"
        class="waves-effect waves-light btn-small blue-grey lighten-1"
      >
        Unfollow
      </button>
    </div>
  </div>
  <div v-else>
    <button class="waves-effect waves-light btn-small blue-grey">
      Loading
    </button>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref, watch } from "vue";
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
    watch(
      () => props.profileUserId,
      (newValue) => {
        getUserFollowingAndCheckIfFollowing(newValue);
      }
    );

    const hasComponentInitiallyLoaded = ref(false);

    const store = useStore();
    const loggedInUser = computed(() => store.state.user);

    const isFollowing = ref(null);

    // Get fresh value of following array incase the user has used another device since,
    // in these scenarios we cannot rely on local storage of the browser.
    // There is too many edge cases to consider when using vuex for storing these things, just
    // to simply save calls to the database - it isnt worth it for now atleast.
    onBeforeMount(async () => {
      await getUserFollowingAndCheckIfFollowing(props.profileUserId);
      hasComponentInitiallyLoaded.value = true;
    });

    const getUserFollowingAndCheckIfFollowing = async (userId) => {
      let response = await ProfileService.getUserFollowing(
        loggedInUser.value._id
      );
      let following = [];
      if (response.status === "success" && response.data.data.length) {
        following = response.data.data[0].following;
      }
      // compare logged in users following to the userId of the profile to see whether
      // they are already following or not - this determines the follow/unfollow functionality button
      isFollowing.value = following.some((userEl) => userEl._id === userId);
    };

    let processLocker = false;

    const response = ref(null);
    const addFollowing = async () => {
      if (!processLocker) {
        processLocker = true;
        response.value = await ProfileService.addFollowingToLoggedInUser(
          props.profileUserId
        );
        if (response.value.status === "success") {
          isFollowing.value = true;
          context.emit("incrementFollowerCounter");
        }
        processLocker = false;
      }
    };
    const removeFollowing = async () => {
      if (!processLocker) {
        processLocker = true;
        response.value = await ProfileService.removeFollowingFromLoggedInUser(
          props.profileUserId
        );
        if (response.value.status === 204) {
          isFollowing.value = false;
          context.emit("decrementFollowerCounter");
        }
        processLocker = false;
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
