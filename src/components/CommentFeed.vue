<template>
  <div
    v-for="(comment, index) in comments"
    :key="comment.id"
    class="comment-block"
  >
    <div class="options">
      <Comment :comment="comment" />
      <Vote :document="comment" documentType="comment" />
      <div v-if="deleteCommentResponse?.message">
        {{ deleteCommentResponse.message }}
      </div>
      <ConfirmationBox
        v-if="
          loggedInUser.role === 'admin' ||
          (comment.user && loggedInUser._id === comment.user._id)
        "
        :uniqueKey="index"
        :shrinkButton="true"
        @deleteDocument="deleteComment($event)"
      >
        <template v-slot:button-text>
          <i class="material-icons right">delete</i></template
        >
        <template v-slot:button-popup-text
          >Are you sure you want to delete your comment?</template
        >
      </ConfirmationBox>
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
      <i class="material-icons left">refresh</i>
      Fetch more comments
    </button>
  </div>
  <div v-if="responseResults === 0">No more comments left on this post!</div>
  <div v-if="response">
    {{ response.message }}
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import FeedService from "@/services/FeedService.js";
import Comment from "@/components/Comment";
import Loader from "@/components/Loader";
import Vote from "@/components/Vote";
import { useStore } from "vuex";
import ConfirmationBox from "@/components/ConfirmationBox";
export default {
  components: {
    Comment,
    Loader,
    Vote,
    ConfirmationBox,
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
    sort: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    watch(
      () => props.newComment,
      (newValue) => {
        comments.value.unshift(newValue);
      }
    );

    const store = useStore();
    const loggedInUser = computed(() => store.state.user);

    const comments = ref([]);

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
        currentPage,
        props.sort
      );

      if (response.value.status === "success") {
        console.log(response.value);
        comments.value = [...comments.value, ...response.value.data.data];
        responseResults.value = response.value.results;
      }
    };

    const deleteCommentResponse = ref(null);
    const deleteComment = async (commentIndex) => {
      let commentToDelete = comments.value[commentIndex];
      console.log(commentToDelete);
      deleteCommentResponse.value = await FeedService.deleteComment(
        commentToDelete.id
      );
      if (deleteCommentResponse.value.status === 204) {
        comments.value.splice(commentIndex, 1);
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
      loggedInUser,
      comments,
      isLoading,
      responseResults,
      response,
      handleManualFetch,
      deleteCommentResponse,
      deleteComment,
    };
  },
};
</script>

<style scoped>
.comment-block {
  padding-bottom: 10px;
  text-align: left;
}

i.left {
  margin-right: 5px;
}
i.right {
  margin-left: 0;
}
</style>
