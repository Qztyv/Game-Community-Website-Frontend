<template>
  <div
    v-for="comment in comments"
    :key="comment.id"
    class="user-comments-wrapper"
  >
    <div class="post-title-wrapper white-text card-panel blue-grey darken-1">
      <p v-if="comment.post">
        Post:
        <router-link
          class="post-link"
          :to="{ name: 'PostSection', params: { id: comment.post.id } }"
        >
          <i>{{ comment.post.postTitle }}</i>
        </router-link>
      </p>
      <p v-else>Post: [Deleted]</p>
    </div>
    <div class="comment-content-wrapper">
      <Comment :comment="comment" />
      <p>Likes: {{ comment.likes }} Dislikes: {{ comment.dislikes }}</p>
    </div>
  </div>
  <div v-if="isLoading">
    <Loader />
  </div>
  <div v-if="responseResults !== 0">
    <button
      @click="handleManualFetch"
      class="waves-effect waves-light btn-small blue-grey"
    >
      <i class="material-icons left">refresh</i>Fetch More Comments
    </button>
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

<style scoped>
.user-comments-wrapper {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  position: relative;
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 10px;
  text-align: left;
}

@media only screen and (max-width: 992px) {
  .user-comments-wrapper {
    width: 80%;
  }
}

.post-title-wrapper {
  border-radius: 0px;
}

.post-link {
  color: white;
}
.post-link:hover {
  text-decoration: underline;
}

.card-panel {
  padding: 18px 18px 18px 10px;
  margin: 0;
}

.comment-content-wrapper {
  padding: 5px 0px 0px 10px;
}
i.left {
  margin-right: 5px;
}
</style>
