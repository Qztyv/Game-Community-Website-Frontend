<template>
  <div class="home">
    <div v-if="Object.keys(user).length">
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

import Feed from "@/components/Feed";
import Loader from "@/components/Loader";

export default {
  name: "Home",
  components: {
    Loader,
    Feed,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.user);
    const postTitle = ref(null);
    const postContent = ref(null);

    const addPost = async () => {};

    return {
      user,
      postTitle,
      postContent,
      addPost,
    };
  },
};
</script>
