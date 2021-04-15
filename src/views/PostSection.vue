<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="postResponse?.message" class="white-text card-panel red">
      <span>{{ postResponse.message }}</span>
    </div>
    <div v-if="post" id="post-section">
      <Post :post="post" />
      <div v-if="post.user && user._id === post.user._id">
        <router-link :to="{ name: 'UpdatePost', params: { id: post.id } }">
          Update Post
        </router-link>
      </div>
      <div v-if="deletePostResponse?.message" class="white-text card-panel red">
        <span>{{ deletePostResponse.message }}</span>
      </div>
      <div
        v-if="
          user.role === 'admin' || (post.user && user._id === post.user._id)
        "
      >
        <a href="#" @click="deletePost">Delete Post</a>
      </div>

      <div id="add-comment">
        <!-- Can add 2 paths here, one for logged in users and one for non-logged in users - to get rid of the text box -->
        <div v-if="!Object.keys(user).length">
          <p>Login or Sign-up to leave a comment</p>
        </div>
        <div v-else>
          <form @submit.prevent="addComment" class="comment-form">
            <div
              v-if="commentResponse?.message"
              class="white-text card-panel red"
            >
              <span>{{ commentResponse.message }}</span>
            </div>

            <div class="input-wrapper">
              <label for="postContent">Comment as {{ user.name }}</label>
              <textarea
                type="text"
                id="postContent"
                placeholder="What are your thoughts?"
                v-model="comment"
                maxlength="3000"
                minlength="1"
                class="materialize-textarea"
                required
              />
            </div>
            <button
              type="submit"
              class="waves-effect waves-light btn-small blue-grey lighten-1"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
      <div id="comments">
        <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
        <Suspense>
          <template #default>
            <CommentFeed
              :postId="post.id"
              :sort="sortBy"
              :key="sortId"
              :newComment="newComment"
            />
          </template>
          <template #fallback>
            <Loader />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
  <div v-else><Loader /></div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import Post from "@/components/Post";
import FeedService from "@/services/FeedService.js";
import Loader from "@/components/Loader";
import CommentFeed from "@/components/CommentFeed";
import SortFeedButtons from "@/components/SortFeedButtons";
import { useRouter } from "vue-router";
export default {
  components: {
    Post,
    CommentFeed,
    Loader,
    SortFeedButtons,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.user);
    console.log(user.value);
    const hasComponentInitiallyLoaded = ref(false);

    const postResponse = ref(null);
    const post = ref(null);
    const getPost = async () => {
      postResponse.value = await FeedService.getPost(props.id);
      if (postResponse.value.status === "success") {
        post.value = postResponse.value.data.data;
      }
    };

    onBeforeMount(async () => {
      await getPost();
      hasComponentInitiallyLoaded.value = true;
    });

    const comment = ref(null);
    const commentResponse = ref(null);
    const newComment = ref({}); // reactivity - when new comment is added the child component will detect prop change via watch()
    const addComment = async () => {
      commentResponse.value = await FeedService.addCommentOnPost(props.id, {
        content: comment.value,
      });
      if (commentResponse.value.status === "success") {
        newComment.value = {
          content: commentResponse.value.data.data.content,
          createdAt: commentResponse.value.data.data.createdAt,
          id: commentResponse.value.data.data.id,
          post: commentResponse.value.data.data.post,
          user: user.value,
        };
        comment.value = null;
        post.value.comments++;
      }
    };
    const sortId = ref(0);
    const sortBy = ref("-createdAt");
    const updateFeedSortBy = (newSortBy) => {
      sortBy.value = newSortBy;
      sortId.value++;
    };

    let deletePostResponse = ref(null);
    const deletePost = async () => {
      deletePostResponse.value = await FeedService.deletePost(props.id);

      if (deletePostResponse.value.status === 204) {
        store.dispatch("addNotification", {
          type: "success",
          message: "Post Deleted!",
        });
        router.push({ name: "Login" });
      }
    };

    return {
      user,
      hasComponentInitiallyLoaded,
      postResponse,
      post,
      comment,
      commentResponse,
      newComment,
      addComment,
      sortId,
      sortBy,
      updateFeedSortBy,
      deletePostResponse,
      deletePost,
    };
  },
};
</script>

<style scoped>
form {
  margin-top: 10px;
}

.comment-form {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  padding: 10px;
  width: 85%;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
}
</style>
