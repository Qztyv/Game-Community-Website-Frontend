<template>
  <div v-if="profileFollowersResponse">
    {{ profileFollowersResponse.message }}
  </div>
  <h2>List of Followers</h2>
  <div v-if="hasComponentInitiallyLoaded">
    <div class="follower-list">
      <div v-for="follower in followers" :key="follower._id">
        <router-link
          :to="{ name: 'UserProfile', params: { userId: follower._id } }"
        >
          {{ follower.name }}
        </router-link>
        <div v-if="userId !== loggedInUser._id">
          <div v-if="loggedInUser._id !== follower._id">
            <button>Follow</button>
          </div>
        </div>
        <!-- If user is on their own profile on their own followers page, they can remove
             people who follow them -->
        <div v-else>
          <button>Remove</button>
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
  setup(props) {
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
      profileFollowersResponse.value = await ProfileService.getUserFollowers(
        props.userId
      );
      console.log(profileFollowersResponse.value);
      if (
        profileFollowersResponse.value.status === "success" &&
        profileFollowersResponse.value.data.data.length
      ) {
        followers.value = profileFollowersResponse.value.data.data[0].followers;
      }
      console.log("Profile followers are: ", followers.value);

      if (props.userId !== loggedInUser.value._id) {
        // get logged in user following so we can compare against profile followers
        // and allow our logged in user to follow / unfollow users they have also.
        loggedInUserFollowingResponse.value = await ProfileService.getUserFollowing(
          loggedInUser.value._id
        );
        if (
          loggedInUserFollowingResponse.value.status === "success" &&
          loggedInUserFollowingResponse.value.data.data.length
        ) {
          loggedInFollowing.value =
            loggedInUserFollowingResponse.value.data.data[0].following;
        }
        console.log("Logged in following is: ", loggedInFollowing.value);
      }
      hasComponentInitiallyLoaded.value = true;
    });
    return {
      hasComponentInitiallyLoaded,
      loggedInUser,
      followers,
      profileFollowersResponse,
    };
  },
};
</script>

<style></style>
