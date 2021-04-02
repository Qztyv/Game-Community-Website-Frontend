<template>
  <div id="post" v-for="post in posts" :key="post.id">
    <Post :post="post" />
  </div>
  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-if="responseResults === 0">No more posts left in the feed!</div>
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
    const responseResults = ref(0);
    const currentPage = ref(0);
    const limit = 5;

    const isLoading = ref(false);

    const fetchFeed = async () => {
      currentPage.value++;

      const response = await FeedService.getAllPosts(limit, currentPage.value);
      console.log(response);
      if (response.status === "success") {
        posts.value = [...posts.value, ...response.data.data];
        responseResults.value = response.results;
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
    };
  },
};
</script>

<style></style>
