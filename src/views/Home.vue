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
          name="postTitle"
          placeholder="Title"
          v-model="postTitle"
          minlength="1"
          maxlength="300"
          required
        />
        <label for="image">Select Post Image</label>
        <input
          type="file"
          @change="image = $event.target.files[0]"
          accept="image/*"
          id="image"
          name="image"
        />
        <label for="postContent">Post Text Content:</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
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
            <PostFeed :sort="sortBy" :key="sortId" feedType="All" />
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

import FeedService from "@/services/FeedService";
import SortFeedButtons from "@/components/SortFeedButtons";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";

export default {
  name: "Home",
  components: {
    SortFeedButtons,
    Loader,
    PostFeed,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const user = computed(() => store.state.user);
    const postTitle = ref(null);
    const image = ref(null);
    const postContent = ref(null);

    const response = ref(null);
    const addPost = async () => {
      // Need to create a multi-part form since part of the form contains an image that
      // we are sending. If we dont do this then the image is ignored.
      const form = new FormData();
      // the first parameter must match what the backend API / mongodb model schema expects
      form.append("postTitle", postTitle.value);
      if (image.value !== null) {
        form.append("image", image.value);
      }
      if (postContent.value !== null) {
        form.append("postContent", postContent.value);
      }

      response.value = await FeedService.createPost(form);
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
      image,
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
