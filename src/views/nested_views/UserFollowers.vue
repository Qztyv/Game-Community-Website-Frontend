<template>
  <div v-if="profileFollowersResponse">
    {{ profileFollowersResponse.message }}
  </div>
  <h2>List of Active Followers</h2>
  <div v-if="hasComponentInitiallyLoaded">
    <div class="follower-list">
      <div v-for="(follower, index) in followers" :key="follower._id">
        <router-link
          :to="{ name: 'UserProfile', params: { userId: follower._id } }"
        >
          {{ follower.name }}
        </router-link>

        <div
          v-if="
            loggedInUser._id !== follower._id &&
            Object.keys(loggedInUser).length
          "
        >
          <button v-if="!follower.isBeingFollowed" @click="addFollowing(index)">
            Follow
          </button>
          <button
            v-if="follower.isBeingFollowed"
            @click="removeFollowing(index)"
          >
            Unfollow
          </button>
        </div>

        <!-- If user is on their own profile on their own followers page, they can remove
             people who follow them -->
        <div v-if="userId === loggedInUser._id">
          <button @click="removeFollower(index)">Remove</button>
        </div>
      </div>
      <p v-if="!followers.length">This user has no activated followers ;(</p>
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
import followUtils from "./../../utils/followUtils.js";

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

    // Get fresh value of follower array incase the user has used another device since,
    // in these scenarios we cannot rely on local storage of the browser.
    // There is too many edge cases to consider when using vuex for storing these things, just
    // to simply save calls to the database - it isnt worth it for now atleast.
    const followers = ref([]);
    let profileFollowersResponse = ref(null);
    const loggedInFollowing = ref([]);
    onBeforeMount(async () => {
      followers.value = await getProfileFollowers();

      if (Object.keys(loggedInUser.value).length) {
        // get logged in user following so we can compare against profile followers
        // and allow our logged in user to follow / unfollow users they have also.
        loggedInFollowing.value = await followUtils.getLoggedInFollowing(
          loggedInUser.value._id
        );

        if (loggedInFollowing.value != undefined) {
          followUtils.appendIsBeingFollowedProperty(
            followers.value,
            loggedInFollowing.value
          );
        }
      }
      hasComponentInitiallyLoaded.value = true;
    });

    const getProfileFollowers = async () => {
      // set response in reactive variable to display on template if something goes wrong
      profileFollowersResponse.value = await ProfileService.getUserFollowers(
        props.userId
      );
      if (
        profileFollowersResponse.value.status === "success" &&
        profileFollowersResponse.value.data.data.length
      ) {
        return profileFollowersResponse.value.data.data[0].followers;
      }
      return [];
    };

    const addFollowing = (followerIndex) => {
      followUtils.addFollowing(
        followers.value,
        followerIndex,
        context,
        props.userId,
        loggedInUser.value._id
      );
    };

    const removeFollowing = (followerIndex) => {
      followUtils.removeFollowing(
        followers.value,
        followerIndex,
        context,
        props.userId,
        loggedInUser.value._id
      );
    };

    // If user if viewing their own profile, they should be able to remove a follower
    // as well as follow them
    const removeFollower = (followerIndex) => {
      followUtils.removeFollower(followers.value, followerIndex, context);
    };
    return {
      hasComponentInitiallyLoaded,
      loggedInUser,
      followers,
      profileFollowersResponse,
      addFollowing,
      removeFollowing,
      removeFollower,
    };
  },
};
</script>

<style></style>
