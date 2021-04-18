<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="response?.message" class="white-text card-panel red">
      <span>{{ response.message }}</span>
    </div>
    <div
      v-if="user"
      class="user-profile-wrapper white-text card-panel blue-grey darken-1"
    >
      <div class="user-profile">
        <img
          :src="user.photo"
          alt="Profile Photo"
          width="168"
          height="168"
          class="profile-image"
        />
        <div class="user-profile-options-wrapper">
          <h5 class="user-profile-name">
            {{ user.name }}
            <span v-if="user.role === 'admin'"> - Admin</span>
            <span v-if="user.banned"> - Banned</span>
          </h5>
          <div class="follow-stats">
            <div class="follow-stats-items">
              <router-link
                :to="{ name: 'UserFollowers', params: { userId: userId } }"
              >
                {{ user.followers }} followers</router-link
              >
            </div>
            <div class="follow-stats-items">
              <router-link
                :to="{ name: 'UserFollowing', params: { userId: userId } }"
                >{{ user.following }} following</router-link
              >
            </div>

            <div
              class="follow-stats-items"
              v-if="
                loggedInUser._id !== user._id &&
                Object.keys(loggedInUser).length
              "
            >
              <FollowOptions
                :profileUserId="user._id"
                @incrementFollowerCounter="user.followers++"
                @decrementFollowerCounter="user.followers--"
              />
            </div>
          </div>
          <div
            class="admin-options"
            v-if="
              loggedInUser.role === 'admin' && loggedInUser._id !== user._id
            "
          >
            <div v-if="adminOptionResponse">
              {{ adminOptionResponse.message }}
            </div>
            <p v-if="user.banned">Hidden Ban Reason: {{ user.banReason }}</p>
            Admin Options:
            <button
              v-if="!user.banned"
              @click="openBanForm = !openBanForm"
              class="waves-effect waves-light btn-small red lighten-2"
            >
              Ban
            </button>
            <button
              v-else
              @click="unbanUser"
              class="waves-effect waves-light btn-small orange lighten-2"
            >
              Unban
            </button>
            <div class="ban-form" v-if="openBanForm">
              <form @submit.prevent="banUser">
                <div class="card-panel">
                  <label for="banReason">Enter the ban reason</label>
                  <textarea
                    id="banReason"
                    maxlength="300"
                    v-model="banReason"
                    placeholder="Reason"
                    class="materialize-textarea"
                  />
                  <button
                    type="submit"
                    class="waves-effect waves-light btn-small red lighten-2"
                  >
                    Ban User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="chosen-feed">
        <router-link
          :to="{ name: 'UserPosts', params: { userId: userId } }"
          class="chosen-feed-items"
          >All Posts</router-link
        >

        <router-link
          :to="{ name: 'UserComments', params: { userId: userId } }"
          class="chosen-feed-items"
          >All Comments</router-link
        >
      </div>
    </div>
    <router-view
      :userId="userId"
      :followers="followers"
      :following="following"
      @decrementFollowerCounter="user.followers--"
      @decrementFollowingCounter="user.following--"
      @incrementFollowingCounter="user.following++"
    ></router-view>
  </div>
  <div v-else>
    <Loader />
  </div>
</template>

<script>
import { computed, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import FeedService from "@/services/FeedService.js";
import FollowOptions from "@/components/FollowOptions";
import Loader from "@/components/Loader";
import ProfileService from "../services/ProfileService";
import followUtils from "../utils/followUtils";
export default {
  components: {
    FollowOptions,
    Loader,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // have to watch for new props as vue does not reload components if you are on the same
    // url but have changed the parameter. This use case happens when you view a users profile, and then
    // decide to select your profile via the Navbar. The profile navbar link targets the same
    // path as the user profile link. Without this, the user will not get an updated component showing their info
    watch(
      () => props.userId,
      (newUserId) => {
        openBanForm.value = false;
        getUser(newUserId);
      }
    );
    const store = useStore();

    const loggedInUser = computed(() => store.state.user);

    const hasComponentInitiallyLoaded = ref(false);
    const user = ref(null);
    const response = ref(null);
    let followers = ref([]);
    let following = ref([]);
    const getUser = async (id) => {
      hasComponentInitiallyLoaded.value = false;
      response.value = await FeedService.getUser(id);
      if (response.value.status === "success") {
        user.value = response.value.data.data;
        // get the followers and following of that user, and we send that down to the sub-router views
        followers.value = await followUtils.getProfileFollowers(id);
        // we need to count the length of the array to get the accurate number (excludes deactivated accounts)
        user.value.followers = followers.value.length;
        following.value = await followUtils.getProfileFollowing(id);
        user.value.following = following.value.length;
      }
      hasComponentInitiallyLoaded.value = true;
    };

    onBeforeMount(async () => {
      await getUser(props.userId);
      hasComponentInitiallyLoaded.value = true;
    });

    const openBanForm = ref(false);
    const banReason = ref(null);

    const adminOptionResponse = ref(null);
    const banUser = async () => {
      if (!banReason.value || banReason.value.trim() === "") {
        banReason.value = "No Reason";
      }
      adminOptionResponse.value = await ProfileService.banUser(props.userId, {
        banReason: banReason.value,
      });

      if (adminOptionResponse.value.status === "success") {
        user.value.banned = true;
        openBanForm.value = false;
        user.value.banReason = banReason.value;
        banReason.value = null;
      }
    };

    const unbanUser = async () => {
      adminOptionResponse.value = await ProfileService.unbanUser(props.userId);
      if (adminOptionResponse.value.status === "success") {
        user.value.banned = false;
      }
    };
    return {
      response,
      hasComponentInitiallyLoaded,
      user,
      followers,
      following,
      loggedInUser,
      openBanForm,
      banReason,
      banUser,
      adminOptionResponse,
      unbanUser,
    };
  },
};
</script>

<style scoped>
a {
  color: white;
}

a:hover {
  text-decoration: underline;
}
a.router-link-exact-active {
  text-decoration: underline;
  background-color: #546e7a;
  cursor: pointer;
}

.user-profile-wrapper {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 50%;
  border-radius: 4px;
}

.user-profile {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
@media only screen and (max-width: 992px) {
  .user-profile-wrapper {
    width: 80%;
  }
}
@media only screen and (max-width: 570px) {
  .user-profile img {
    width: 140px;
    height: 140px;
  }
}

@media only screen and (max-width: 485px) {
  .user-profile-wrapper {
    display: block;
  }
  .user-profile {
    display: block;
  }
}

.profile-image {
  border: 3px solid #dfdfdd;
  justify-self: left;
}

.user-profile-name {
  text-align: left;
}

.follow-stats {
  display: flex;
  text-align: left;
}

.follow-stats-items {
  margin: 10px 10px 10px 0;
}

.chosen-feed {
  align-self: flex-end;
}

.chosen-feed-items {
  margin: 0px 10px 0px 0px;
}
</style>
