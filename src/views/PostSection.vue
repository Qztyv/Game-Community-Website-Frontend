<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="response">
      {{ response.message }}
    </div>
    <div v-if="post" id="post">
      <Post :post="post" />
    </div>
  </div>
  <div v-else><Loader /></div>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import Post from "@/components/Post";
import FeedService from "@/services/FeedService.js";
import Loader from "@/components/Loader";

export default {
  components: {
    Post,
    Loader,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const hasComponentInitiallyLoaded = ref(false);

    const response = ref(null);
    const post = ref(null);
    const getPost = async () => {
      response.value = await FeedService.getPost(props.id);
      if (response.value.status === "success") {
        post.value = response.value.data.data;
      }
      console.log(response.value);
    };

    onBeforeMount(async () => {
      await getPost();
      hasComponentInitiallyLoaded.value = true;
    });

    return {
      hasComponentInitiallyLoaded,
      response,
      post,
    };
  },
};
</script>

<style></style>
