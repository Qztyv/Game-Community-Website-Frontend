<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="user">
      <div id="user-profile">
        <img :src="user.photo" alt="Profile Photo" width="50" height="50" />
        <p>
          {{ user.name }}
          <span v-if="user.role === 'admin'"> - Admin</span>
        </p>
        <div class="follow-stats">
          <div class="followers">
            <router-link
              :to="{ name: 'UserFollowers', params: { userId: userId } }"
            >
              followers: {{ user.followers }}</router-link
            >
          </div>
          <div class="following">following: {{ user.following }}</div>
        </div>
        <div v-if="loggedInUser._id !== user._id">
          <FollowOptions
            :profileUserId="user._id"
            @incrementFollowerCounter="user.followers++"
            @decrementFollowerCounter="user.followers--"
          />
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
        <!-- <div id="own_user" v-if="loggedInUser._id === user._id">
        | <router-link to="/user/post-votes">Voted Posts</router-link> |
        <router-link to="/user/comment-votes">Voted Comments</router-link>
      </div> -->
      </div>
      <router-view :userId="userId"></router-view>
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
      (newValue) => {
        getUser(newValue);
      }
    );
    const store = useStore();

    const loggedInUser = computed(() => store.state.user);

    const hasComponentInitiallyLoaded = ref(false);
    const user = ref(null);
    const response = ref(null);
    const getUser = async (id) => {
      response.value = await FeedService.getUser(id);
      if (response.value.status === "success") {
        user.value = response.value.data.data;
      }
    };

    onBeforeMount(async () => {
      await getUser(props.userId);
      hasComponentInitiallyLoaded.value = true;
    });

    return {
      response,
      hasComponentInitiallyLoaded,
      user,
      loggedInUser,
    };
  },
};
</script>

<style></style>
