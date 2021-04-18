<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div
      v-if="profileFollowingResponse?.message"
      class="white-text card-panel red"
    >
      <span>{{ profileFollowingResponse.message }}</span>
    </div>
    <div class="following-list">
      <div
        v-for="(followingUser, index) in followingClone"
        :key="followingUser._id"
        class="following-item card-panel blue-grey darken-1"
      >
        <div class="profile-image-container">
          <img
            :src="
              followingUser.photo
                ? followingUser.photo
                : require('@/assets/default_profile_image.png')
            "
            alt="Profile Photo"
            width="50"
            height="50"
            class="profile-image"
          />
        </div>
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
            class="waves-effect waves-light btn-small blue-grey lighten-1"
          >
            Follow
          </button>
          <button
            v-if="followingUser.isBeingFollowed"
            @click="removeFollowing(index)"
            class="waves-effect waves-light btn-small blue-grey lighten-1"
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
  inheritAttrs: false,
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

<style scoped>
.following-item {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 10px;
  padding: 10px;
}

a {
  color: white;
}

a:hover {
  text-decoration: underline;
}

@media only screen and (max-width: 992px) {
  .following-item {
    width: 80%;
  }
}

.btn-small {
  height: 25px;
  line-height: 25px;
  font-size: 11px;
}
</style>
