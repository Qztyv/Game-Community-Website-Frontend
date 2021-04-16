<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="user">
      <div id="user-profile">
        <img
          :src="user.photo"
          alt="Profile Photo"
          width="168"
          height="168"
          class="profile-image"
        />
        <p>
          {{ user.name }}
          <span v-if="user.role === 'admin'"> - Admin</span>
          <span v-if="user.banned"> - Banned</span>
        </p>
        <div class="follow-stats">
          <div class="followers">
            <router-link
              :to="{ name: 'UserFollowers', params: { userId: userId } }"
            >
              Total Followers: {{ user.followers }}</router-link
            >
          </div>
          <div class="following">
            <router-link
              :to="{ name: 'UserFollowing', params: { userId: userId } }"
              >Total Following: {{ user.following }}</router-link
            >
          </div>
        </div>
        <div
          v-if="
            loggedInUser._id !== user._id && Object.keys(loggedInUser).length
          "
        >
          <FollowOptions
            :profileUserId="user._id"
            @incrementFollowerCounter="user.followers++"
            @decrementFollowerCounter="user.followers--"
          />
        </div>
        <div
          class="admin-options"
          v-if="loggedInUser.role === 'admin' && loggedInUser._id !== user._id"
        >
          <div v-if="adminOptionResponse">
            {{ adminOptionResponse.message }}
          </div>
          <p v-if="user.banned">Hidden Ban Reason: {{ user.banReason }}</p>
          Admin Options:
          <button v-if="!user.banned" @click="openBanForm = !openBanForm">
            Ban
          </button>
          <button v-else @click="unbanUser">Unban</button>
          <div class="ban-form" v-if="openBanForm">
            <form @submit.prevent="banUser">
              <label for="banReason">Enter the ban reason</label>
              <textarea id="banReason" maxlength="300" v-model="banReason">
                Reason (optional)
              </textarea>
              <button type="submit">Ban User</button>
            </form>
          </div>
        </div>
      </div>
      <div id="chosen_feed">
        <router-link :to="{ name: 'UserPosts', params: { userId: userId } }"
          >All Posts</router-link
        >
        |
        <router-link :to="{ name: 'UserComments', params: { userId: userId } }"
          >All Comments</router-link
        >
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
        followers.value = await followUtils.getProfileFollowers(id);
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

<style></style>
