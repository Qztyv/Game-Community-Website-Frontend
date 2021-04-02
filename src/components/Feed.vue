<template>
  <div class="post" v-for="post in posts" :key="post.id">
    <router-link
      class="post-link"
      :to="{ name: 'PostSection', params: { id: post.id } }"
      ><Post :post="post"
    /></router-link>
  </div>
  <div v-if="isLoading">
    <Loader />
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
  async setup() {
    const posts = ref([]);
    const responseResults = ref(-1);
    const currentPage = ref(0);
    const limit = 5;

    const isLoading = ref(false);

    const response = ref(null);
    const fetchFeed = async () => {
      currentPage.value++;

      response.value = await FeedService.getAllPosts(limit, currentPage.value);

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
