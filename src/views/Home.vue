<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <div class="home">
    <div id="create-a-post" v-if="Object.keys(user).length">
      <form @submit.prevent="addPost">
        <label for="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          placeholder="Title"
          v-model="postTitle"
          minlength="1"
          maxlength="300"
          required
        />
        <label for="postContent">Post a Message:</label>
        <textarea
          type="text"
          id="postContent"
          placeholder="Text (optional)"
          v-model="postContent"
          maxlength="3000"
        />
        <button type="submit">Add Post</button>
      </form>
    </div>
    <div id="home-feed">
      <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
      <div>
        <Suspense>
          <template #default>
            <PostFeed :sort="sortBy" :key="sortId" />
          </template>
          <template #fallback>
            <Loader />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";
import FeedService from "@/services/FeedService";
import SortFeedButtons from "@/components/SortFeedButtons";
export default {
  name: "Home",
  components: {
    Loader,
    PostFeed,
    SortFeedButtons,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.user);
    const postTitle = ref(null);
    const postContent = ref(null);

    const response = ref(null);
    const addPost = async () => {
      response.value = await FeedService.createPost({
        postTitle: postTitle.value,
        postContent: postContent.value,
      });
      if (response.value.status === "success") {
        router.push({
          name: "PostSection",
          params: { id: response.value.data.data.id },
        });
      }
    };

    const sortId = ref(0);
    const sortBy = ref("-createdAt");
    const updateFeedSortBy = (newSortBy) => {
      sortBy.value = newSortBy;
      sortId.value++;
    };
    return {
      user,
      postTitle,
      postContent,
      addPost,
      response,
      sortId,
      sortBy,
      updateFeedSortBy,
    };
  },
};
</script>
