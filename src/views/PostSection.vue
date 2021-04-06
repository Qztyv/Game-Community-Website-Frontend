<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="postResponse">
      {{ postResponse.message }}
    </div>
    <div v-if="post" id="post">
      <Post :post="post" />
      <div id="add-comment">
        <!-- Can add 2 paths here, one for logged in users and one for non-logged in users - to get rid of the text box -->
        <div v-if="!Object.keys(user).length">
          <p>Login or Sign-up to leave a comment</p>
        </div>
        <div v-else>
          <div v-if="commentResponse">
            {{ commentResponse.message }}
          </div>
          <p>Comment as {{ user.name }}</p>
          <form @submit.prevent="addComment">
            <textarea
              type="text"
              id="postContent"
              placeholder="What are your thoughts?"
              v-model="comment"
              maxlength="3000"
              minlength="1"
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      </div>
      <div id="comments">
        <p>Sorting by: {{ currentSort }}</p>
        <button @click="sortByNewest">Newest First</button>
        <button @click="sortByOldest">Oldest First</button>
        <Suspense>
          <template #default>
            <CommentFeed
              :postId="post.id"
              :sort="sort"
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

export default {
  components: {
    Post,
    CommentFeed,
    Loader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const user = computed(() => store.state.user);

    const hasComponentInitiallyLoaded = ref(false);

    const postResponse = ref(null);
    const post = ref(null);
    const getPost = async () => {
      postResponse.value = await FeedService.getPost(props.id);
      if (postResponse.value.status === "success") {
        post.value = postResponse.value.data.data;
      }
      console.log(postResponse.value);
    };

    onBeforeMount(async () => {
      await getPost();
      hasComponentInitiallyLoaded.value = true;
    });

    const comment = ref(null);
    const commentResponse = ref(null);
    const newComment = ref({});
    const addComment = async () => {
      commentResponse.value = await FeedService.addCommentOnPost(props.id, {
        content: comment.value,
      });
      if (commentResponse.value.status === "success") {
        console.log("comment added");
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
    const sort = ref("-createdAt");
    const currentSort = ref("Newest");
    const sortByNewest = () => {
      sort.value = "-createdAt";
      sortId.value++;
      currentSort.value = "Newest";
    };
    const sortByOldest = () => {
      sort.value = "createdAt";
      sortId.value++;
      currentSort.value = "Oldest";
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
      sort,
      currentSort,
      sortByNewest,
      sortByOldest,
    };
  },
};
</script>

<style></style>
