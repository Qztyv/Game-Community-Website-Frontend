<template>
  <div v-if="profileFollowingResponse">
    {{ profileFollowingResponse.message }}
  </div>
  <h2>List of Following</h2>
  <div v-if="hasComponentInitiallyLoaded">
    <div class="following-list">
      <div
        v-for="(followingUser, index) in followingClone"
        :key="followingUser._id"
      >
        <router-link
          :to="{ name: 'UserProfile', params: { userId: followingUser._id } }"
        >
          <span v-if="followingUser.banned">
            <del>{{ followingUser.name }}</del>
          </span>
          <span v-else>
            {{ followingUser.name }}
          </span>
        </router-link>
        <div
          v-if="
            loggedInUser._id !== followingUser._id &&
            Object.keys(loggedInUser).length
          "
        >
          <button
            v-if="!followingUser.isBeingFollowed"
            @click="addFollowing(index)"
          >
            Follow
          </button>
          <button
            v-if="followingUser.isBeingFollowed"
            @click="removeFollowing(index)"
          >
            Unfollow
          </button>
        </div>
      </div>
      <p v-if="!followingClone.length">This user is not following anyone ;(</p>
    </div>
  </div>
  <div v-else>
    <Loader />
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import Loader from "@/components/Loader";
import followUtils from "../../utils/followUtils";
export default {
  components: {
    Loader,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    following: {
      type: Array,
      required: true,
    },
    followers: {
      type: Array,
      required: false,
    },
  },
  emits: [
    "decrementFollowerCounter",
    "decrementFollowingCounter",
    "incrementFollowingCounter",
  ],
  setup(props, context) {
    const hasComponentInitiallyLoaded = ref(false);

    const store = useStore();
    const loggedInUser = computed(() => store.state.user);

    // cannot alter prop so need new variable to add a property on later.
    const followingClone = ref([]);
    let profileFollowingResponse = ref(null);
    const loggedInFollowing = ref([]);

    onBeforeMount(async () => {
      followingClone.value = props.following;

      if (Object.keys(loggedInUser.value).length) {
        // Get logged in user following so we can compare against profile following.
        loggedInFollowing.value = await followUtils.getLoggedInFollowing(
          loggedInUser.value._id
        );

        if (loggedInFollowing.value != undefined) {
          followUtils.appendIsBeingFollowedProperty(
            followingClone.value,
            loggedInFollowing.value
          );
        }
      }
      hasComponentInitiallyLoaded.value = true;
    });

    let processLocker = false;
    // In the scenario that a logged in user is viewing another users profile and their following,
    // they should be able to follow the users on that list, or unfollow them if they already follow them.
    // Due to reactivity of the following array, we can change the "isBeingFollowed" property
    // that we previously added, so that the follow/unfollow button for each user on the list is reflected accurately.
    const addFollowing = async (followingIndex) => {
      if (!processLocker) {
        processLocker = true;
        await followUtils.addFollowing(
          followingClone.value,
          followingIndex,
          context,
          props.userId,
          loggedInUser.value._id
        );
        processLocker = false;
      }
    };

    const removeFollowing = async (followingIndex) => {
      if (!processLocker) {
        processLocker = true;
        await followUtils.removeFollowing(
          followingClone.value,
          followingIndex,
          context,
          props.userId,
          loggedInUser.value._id
        );
        processLocker = false;
      }
    };

    return {
      hasComponentInitiallyLoaded,
      loggedInUser,
      followingClone,
      profileFollowingResponse,
      addFollowing,
      removeFollowing,
    };
  },
};
</script>

<style></style>
