<template>
  <div v-if="profileFollowersResponse">
    {{ profileFollowersResponse.message }}
  </div>
  <h2>List of Followers</h2>
  <div v-if="hasComponentInitiallyLoaded">
    <div class="follower-list">
      <div v-for="(follower, index) in followers" :key="follower._id">
        <router-link
          :to="{ name: 'UserProfile', params: { userId: follower._id } }"
        >
          {{ follower.name }}
        </router-link>
        <div v-if="userId !== loggedInUser._id">
          <div v-if="loggedInUser._id !== follower._id">
            <button
              v-if="!follower.isBeingFollowed"
              @click="addFollowing(index)"
            >
              Follow
            </button>
            <button
              v-if="follower.isBeingFollowed"
              @click="removeFollowing(index)"
            >
              Unfollow
            </button>
          </div>
        </div>
        <!-- If user is on their own profile on their own followers page, they can remove
             people who follow them -->
        <div v-else>
          <button @click="removeFollower(index)">Remove</button>
        </div>
      </div>
      <p v-if="!followers.length">This user has no followers ;(</p>
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
    let loggedInUserFollowingResponse = ref(null);
    onBeforeMount(async () => {
      followers.value = await getProfileFollowers();

      // users viewing their own profile will see a "remove" follower button instead
      // of a follow/unfollow.
      if (props.userId !== loggedInUser.value._id) {
        // get logged in user following so we can compare against profile followers
        // and allow our logged in user to follow / unfollow users they have also.
        loggedInFollowing.value = await getLoggedInFollowing();

        appendIsBeingFollowedProperty();
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

    // we get the logged in following to compare against the profile followers, so we can add
    // options to follow / unfollow other peoples followers.
    const getLoggedInFollowing = async () => {
      loggedInUserFollowingResponse.value = await ProfileService.getUserFollowing(
        loggedInUser.value._id
      );
      if (
        loggedInUserFollowingResponse.value.status === "success" &&
        loggedInUserFollowingResponse.value.data.data.length
      ) {
        return loggedInUserFollowingResponse.value.data.data[0].following;
      }
      return [];
    };

    // we use isBeingFollowed property to determine what button to show on template
    // for each follower in the list
    const appendIsBeingFollowedProperty = () => {
      for (let i = 0; i < followers.value.length; i++) {
        for (let y = 0; y < loggedInFollowing.value.length; y++) {
          if (followers.value[i]._id === loggedInFollowing.value[y]._id) {
            followers.value[i].isBeingFollowed = true;
          }
        }
      }
    };
    // In the scenario that a logged in user is viewing another users profile and their followers,
    // they should be able to follow the users on that list, or unfollow them if they already follow them.
    // Due to reactivity of the followers array, we can change the "isBeingFollowed" property
    // that we previously added, so that the follow/unfollow button for each user on the list is reflected accurately.
    const alterFollowRelationShipResponse = ref(null);
    const addFollowing = async (followerIndex) => {
      const userToFollow = followers.value[followerIndex];
      alterFollowRelationShipResponse.value = await ProfileService.addFollowingToLoggedInUser(
        userToFollow._id
      );
      if (alterFollowRelationShipResponse.value.status === "success") {
        followers.value[followerIndex].isBeingFollowed = true;
      }
    };

    const removeFollowing = async (followerIndex) => {
      const userToUnfollow = followers.value[followerIndex];
      alterFollowRelationShipResponse.value = await ProfileService.removeFollowingFromLoggedInUser(
        userToUnfollow._id
      );
      if (alterFollowRelationShipResponse.value.status === 204) {
        followers.value[followerIndex].isBeingFollowed = false;
      }
    };

    // If user if viewing their own profile, they should be able to remove a follower
    const removeFollower = async (followerIndex) => {
      const followerToRemove = followers.value[followerIndex];
      alterFollowRelationShipResponse.value = await ProfileService.removeFollowerFromLoggedInUser(
        followerToRemove._id
      );
      if (alterFollowRelationShipResponse.value.status === 204) {
        // remove the follower from the list, and decrement the counter to represent that
        followers.value.splice(followerIndex, 1);
        context.emit("decrementFollowerCounter");
      }
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
