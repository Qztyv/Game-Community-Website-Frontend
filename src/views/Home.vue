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
      <div>
        <Suspense>
          <template #default>
            <Feed />
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

import Feed from "@/components/Feed";
import Loader from "@/components/Loader";
import FeedService from "@/services/FeedService";
export default {
  name: "Home",
  components: {
    Loader,
    Feed,
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

    return {
      user,
      postTitle,
      postContent,
      addPost,
      response,
    };
  },
};
</script>
