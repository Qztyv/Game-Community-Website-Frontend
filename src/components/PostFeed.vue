<template>
  <div class="post" v-for="post in posts" :key="post.id">
    <router-link
      class="post-link"
      :to="{ name: 'PostSection', params: { id: post.id } }"
    >
      <Post :post="post" />
    </router-link>
  </div>
  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-if="responseResults !== 0">
    <button @click="handleManualFetch">Fetch more posts</button>
  </div>
  <div v-if="responseResults === 0">No more posts left in the feed!</div>
  <div v-if="response">
    {{ response.message }}
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
import Post from "@/components/Post";
import FeedService from "@/services/FeedService.js";
import Loader from "@/components/Loader";

export default {
  components: {
    Post,
    Loader,
  },
  props: {
    sort: {
      type: String,
      required: true,
    },
    feedType: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
  },
  async setup(props) {
    const posts = ref([]);
    const responseResults = ref(-1);
    const limit = 5;
    let currentPage = 0;

    const isLoading = ref(false);

    const response = ref(null);
    const fetchFeed = async () => {
      currentPage++;

      if (props.feedType === "All") {
        response.value = await FeedService.getAllPosts(
          limit,
          currentPage,
          props.sort
        );
      }
      if (props.feedType === "User") {
        response.value = await FeedService.getAllUserPosts(
          props.userId,
          limit,
          currentPage,
          props.sort
        );
      }
      // Only logged in users can access following-feed (backend will authenticate automatically)
      if (props.feedType === "Following") {
        response.value = await FeedService.getAllFollowingPosts(
          limit,
          currentPage,
          props.sort
        );
      }

      if (response.value.status === "success") {
        posts.value = [...posts.value, ...response.value.data.data];
        responseResults.value = response.value.results;
      }
    };
    const handleScroll = async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (responseResults.value === 0 || isLoading.value) {
          return;
        }
        isLoading.value = true;
        await fetchFeed();
        isLoading.value = false;
      }
    };

    const handleManualFetch = async () => {
      isLoading.value = true;
      await fetchFeed();
      isLoading.value = false;
    };
    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    // avoid memory leak
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    await fetchFeed();
    return {
      posts,
      isLoading,
      responseResults,
      response,
      handleManualFetch,
    };
  },
};
</script>

<style scoped>
.post-link {
  color: #2c3e50;
  text-decoration: none;
}
.post {
  padding: 20px;
  cursor: pointer;
  border: 1px solid #39495c;
  margin-bottom: 18px;
}

.post:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
