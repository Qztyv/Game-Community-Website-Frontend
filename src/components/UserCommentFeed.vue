<template>
  <div v-for="comment in comments" :key="comment.id">
    <h3>
      <div v-if="comment.post">
        <router-link
          :to="{ name: 'PostSection', params: { id: comment.post.id } }"
          >{{ comment.post.postTitle }}
        </router-link>
      </div>
      <div v-else>Post Deleted</div>
    </h3>
    <Comment :comment="comment" />
    <p>Likes: {{ comment.likes }} Dislikes: {{ comment.dislikes }}</p>
  </div>
  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-if="responseResults !== 0">
    <button @click="handleManualFetch">Fetch More</button>
  </div>
  <div v-if="responseResults === 0">No more comments made</div>
  <div v-if="response">
    {{ response.message }}
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from "vue";
import FeedService from "@/services/FeedService.js";
import Comment from "@/components/Comment";
import Loader from "@/components/Loader";

export default {
  components: {
    Comment,
    Loader,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    sort: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const comments = ref([]);

    const responseResults = ref(-1);
    const limit = 10;
    let currentPage = 0;

    const isLoading = ref(false);

    const response = ref(null);
    const fetchUserComments = async () => {
      currentPage++;

      response.value = await FeedService.getAllCommentsByUser(
        props.userId,
        limit,
        currentPage,
        props.sort
      );

      if (response.value.status === "success") {
        console.log(response.value);

        comments.value = [...comments.value, ...response.value.data.data];
        responseResults.value = response.value.results;
      }
    };

    const handleScroll = async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (responseResults.value === 0 || isLoading.value) {
          return;
        }
        isLoading.value = true;
        await fetchUserComments();
        isLoading.value = false;
      }
    };
    const handleManualFetch = async () => {
      isLoading.value = true;
      await fetchUserComments();
      isLoading.value = false;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    // avoid memory leak
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    await fetchUserComments();
    return {
      comments,
      isLoading,
      responseResults,
      response,
      handleManualFetch,
    };
  },
};
</script>

<style></style>
