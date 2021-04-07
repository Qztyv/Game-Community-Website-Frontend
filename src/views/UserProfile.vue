<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <div v-if="hasComponentInitiallyLoaded">
    <div id="user-profile">
      <p>{{ user.photo }} PHOTO PLACEHOLDER</p>
      <p>
        {{ user.name }}
        <span v-if="user.role === 'admin'"> - Admin</span>
      </p>
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
  <div v-else><Loader /></div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import FeedService from "@/services/FeedService.js";
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
    const store = useStore();

    const loggedInUser = computed(() => store.state.user);

    const hasComponentInitiallyLoaded = ref(false);
    const user = ref(null);
    const response = ref(null);
    const getUser = async () => {
      response.value = await FeedService.getUser(props.userId);
      if (response.value.status === "success") {
        user.value = response.value.data.data;
        console.log(user.value);
      }
    };

    onBeforeMount(async () => {
      await getUser();
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
