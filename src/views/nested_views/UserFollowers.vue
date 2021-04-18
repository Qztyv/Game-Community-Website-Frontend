<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div
      v-if="profileFollowersResponse?.message"
      class="white-text card-panel red"
    >
      <span>{{ profileFollowersResponse.message }}</span>
    </div>
    <div class="follower-list">
      <div
        v-for="(follower, index) in followersClone"
        :key="follower._id"
        class="follower-item card-panel blue-grey darken-1"
      >
        <div class="profile-image-container">
          <img
            :src="
              follower.photo
                ? follower.photo
                : require('@/assets/default_profile_image.png')
            "
            alt="Profile Photo"
            width="50"
            height="50"
            class="profile-image"
          />
        </div>
        <router-link
          :to="{ name: 'UserProfile', params: { userId: follower._id } }"
        >
          <span v-if="follower.banned">
            <del>{{ follower.name }}</del>
          </span>
          <span v-else>
            {{ follower.name }}
          </span>
        </router-link>

        <div
          v-if="
            loggedInUser._id !== follower._id &&
            Object.keys(loggedInUser).length
          "
        >
          <button
            v-if="!follower.isBeingFollowed"
            @click="addFollowing(index)"
            class="waves-effect waves-light btn-small blue-grey lighten-1"
          >
            Follow
          </button>
          <button
            v-if="follower.isBeingFollowed"
            @click="removeFollowing(index)"
            class="waves-effect waves-light btn-small blue-grey lighten-1"
          >
            Unfollow
          </button>
        </div>

        <!-- If user is on their own profile on their own followers page, they can remove
             people who follow them -->
        <div v-if="userId === loggedInUser._id">
          <ConfirmationBox
            @deleteDocument="removeFollower(index)"
            :uniqueKey="index"
            :shrinkButton="true"
          >
            <template v-slot:button-text>Remove</template>
            <template v-slot:button-popup-text
              >Are you sure you want to remove this follower?</template
            >
          </ConfirmationBox>
        </div>
      </div>
      <p v-if="!followersClone.length">This user has no followers ;(</p>
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
import followUtils from "./../../utils/followUtils.js";
import ConfirmationBox from "@/components/ConfirmationBox";

export default {
  inheritAttrs: false,
  components: {
    Loader,
    ConfirmationBox,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    followers: {
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

    const followersClone = ref([]);
    let profileFollowersResponse = ref(null);
    const loggedInFollowing = ref([]);
    onBeforeMount(async () => {
      // cannot alter props.followers, so make another array to attach property to each element later on
      followersClone.value = props.followers;

      // if we are logged in
      if (Object.keys(loggedInUser.value).length) {
        // get logged in user following so we can compare against profile followers
        // and allow our logged in user to follow / unfollow users they have also.
        loggedInFollowing.value = await followUtils.getLoggedInFollowing(
          loggedInUser.value._id
        );

        // if logged in user has never followed anyone before we cannot apend, so ignore
        // but if they have followed before, it wont be undefined
        if (loggedInFollowing.value != undefined) {
          followUtils.appendIsBeingFollowedProperty(
            followersClone.value,
            loggedInFollowing.value
          );
        }
      }
      hasComponentInitiallyLoaded.value = true;
    });

    let processLocker = false;

    const addFollowing = async (followerIndex) => {
      if (!processLocker) {
        processLocker = true;
        await followUtils.addFollowing(
          followersClone.value,
          followerIndex,
          context,
          props.userId,
          loggedInUser.value._id
        );
        processLocker = false;
      }
    };

    const removeFollowing = async (followerIndex) => {
      if (!processLocker) {
        processLocker = true;
        await followUtils.removeFollowing(
          followersClone.value,
          followerIndex,
          context,
          props.userId,
          loggedInUser.value._id
        );
        processLocker = false;
      }
    };

    // If user if viewing their own profile, they should be able to remove a follower
    // as well as follow them
    const removeFollower = async (followerIndex) => {
      if (!processLocker) {
        processLocker = true;
        await followUtils.removeFollower(
          followersClone.value,
          followerIndex,
          context
        );
        processLocker = false;
      }
    };
    return {
      hasComponentInitiallyLoaded,
      loggedInUser,
      followersClone,
      profileFollowersResponse,
      addFollowing,
      removeFollowing,
      removeFollower,
    };
  },
};
</script>

<style scoped>
.follower-item {
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
  .follower-item {
    width: 80%;
  }
}

.btn-small {
  height: 25px;
  line-height: 25px;
  font-size: 11px;
}
</style>
