<template>
  <div v-if="profileFollowingResponse">
    {{ profileFollowingResponse.message }}
  </div>
  <h2>List of Following</h2>
  <div v-if="hasComponentInitiallyLoaded">
    <div class="following-list">
      <div v-for="(followingUser, index) in following" :key="followingUser._id">
        <router-link
          :to="{ name: 'UserProfile', params: { userId: followingUser._id } }"
        >
          {{ followingUser.name }}
        </router-link>
        <div v-if="loggedInUser._id !== followingUser._id">
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
      <p v-if="!following.length">This user is not following anyone ;(</p>
    </div>
  </div>
  <div v-else>
    <Loader />
  </div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import ProfileService from "../../services/ProfileService";
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

    // Get fresh value of following array incase the user has used another device since,
    // in these scenarios we cannot rely on local storage of the browser.
    // There is too many edge cases to consider when using vuex for storing these things, just
    // to simply save calls to the database - it isnt worth it for now atleast.
    const following = ref([]);
    let profileFollowingResponse = ref(null);
    const loggedInFollowing = ref([]);

    onBeforeMount(async () => {
      following.value = await getProfileFollowing();

      // Get logged in user following so we can compare against profile following.
      loggedInFollowing.value = await followUtils.getLoggedInFollowing(
        loggedInUser.value._id
      );

      followUtils.appendIsBeingFollowedProperty(
        following.value,
        loggedInFollowing.value
      );
      hasComponentInitiallyLoaded.value = true;
    });

    const getProfileFollowing = async () => {
      // set response in reactive variable to display on template if something goes wrong
      profileFollowingResponse.value = await ProfileService.getUserFollowing(
        props.userId
      );
      if (
        profileFollowingResponse.value.status === "success" &&
        profileFollowingResponse.value.data.data.length
      ) {
        return profileFollowingResponse.value.data.data[0].following;
      }
      return [];
    };

    // In the scenario that a logged in user is viewing another users profile and their following,
    // they should be able to follow the users on that list, or unfollow them if they already follow them.
    // Due to reactivity of the following array, we can change the "isBeingFollowed" property
    // that we previously added, so that the follow/unfollow button for each user on the list is reflected accurately.
    const alterFollowRelationShipResponse = ref(null);
    const addFollowing = async (followingIndex) => {
      const userToFollow = following.value[followingIndex];
      alterFollowRelationShipResponse.value = await ProfileService.addFollowingToLoggedInUser(
        userToFollow._id
      );
      if (alterFollowRelationShipResponse.value.status === "success") {
        following.value[followingIndex].isBeingFollowed = true;
        // if user on their own profile refollowing unfollowed people, we want the counter to reflect that
        if (props.userId === loggedInUser.value._id) {
          context.emit("incrementFollowingCounter");
        }
      }
    };

    const removeFollowing = async (followingIndex) => {
      const userToUnfollow = following.value[followingIndex];
      alterFollowRelationShipResponse.value = await ProfileService.removeFollowingFromLoggedInUser(
        userToUnfollow._id
      );
      if (alterFollowRelationShipResponse.value.status === 204) {
        following.value[followingIndex].isBeingFollowed = false;
        // if user on their own profile unfollowing people, we want the counter to reflect that
        if (props.userId === loggedInUser.value._id) {
          context.emit("decrementFollowingCounter");
        }
      }
    };

    return {
      hasComponentInitiallyLoaded,
      loggedInUser,
      following,
      profileFollowingResponse,
      addFollowing,
      removeFollowing,
    };
  },
};
</script>

<style></style>
