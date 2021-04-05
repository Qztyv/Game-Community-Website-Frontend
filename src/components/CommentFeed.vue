<template>
  <div v-for="comment in comments" :key="comment.id">
    <Comment :comment="comment" />
  </div>
  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-if="responseResults !== 0">
    <button @click="handleManualFetch">Fetch more comments</button>
  </div>
  <div v-if="responseResults === 0">No more comments left on this post!</div>
  <div v-if="response">
    {{ response.message }}
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from "vue";
import FeedService from "@/services/FeedService.js";
import Comment from "@/components/Comment";
import Loader from "@/components/Loader";

export default {
  components: {
    Comment,
    Loader,
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
    newComment: {
      type: Object,
      required: true,
    },
  },
  async setup(props) {
    const comments = ref([]);
    watch(
      () => props.newComment,
      (newValue) => {
        comments.value.unshift(newValue);
      }
    );

    const responseResults = ref(-1);
    const limit = 10;
    let currentPage = 0;

    const isLoading = ref(false);

    const response = ref(null);
    const fetchComments = async () => {
      currentPage++;

      response.value = await FeedService.getAllCommentsOnPost(
        props.postId,
        limit,
        currentPage
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
        await fetchComments();
        isLoading.value = false;
      }
    };
    const handleManualFetch = async () => {
      isLoading.value = true;
      await fetchComments();
      isLoading.value = false;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    // avoid memory leak
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    await fetchComments();
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
