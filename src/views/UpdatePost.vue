<template>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="postResponse">
      {{ postResponse.message }}
    </div>
    <div v-if="post" id="post">
      <p v-if="user._id !== post.user._id">
        You do not own this post, and so cannot update it!
      </p>
      <div v-else>
        <div v-if="updateResponse">
          {{ updateResponse.message }}
        </div>
        <form @submit.prevent="updatePost">
          <label for="postTitle">Update Post Title</label>
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
          <img :src="oldPostImage" alt="Post Image" width="750" height="500" />
          <label for="image">Select A New Image</label>
          <input
            type="file"
            @change="image = $event.target.files[0]"
            accept="image/*"
            id="image"
            name="image"
          />
          <label for="postContent">Update Text Content</label>
          <textarea
            type="text"
            id="postContent"
            name="postContent"
            placeholder="Text (optional)"
            v-model="postContent"
            maxlength="3000"
          />
          <button type="submit">Update Post</button>
        </form>
      </div>
    </div>
  </div>
  <div v-else><Loader /></div>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import FeedService from "./../services/FeedService.js";
import Loader from "@/components/Loader";
import { useRouter } from "vue-router";

export default {
  components: {
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
    const router = useRouter();
    const user = computed(() => store.state.user);

    const hasComponentInitiallyLoaded = ref(false);

    const postResponse = ref(null);
    const post = ref(null);
    const getPost = async () => {
      postResponse.value = await FeedService.getPost(props.id);
      if (postResponse.value.status === "success") {
        post.value = postResponse.value.data.data;
      }
    };

    const postTitle = ref(null);
    const oldPostImage = ref(null);
    // new image
    const image = ref(null);
    const postContent = ref(null);
    onBeforeMount(async () => {
      await getPost();
      postTitle.value = post.value.postTitle;
      oldPostImage.value = post.value.image;
      postContent.value = post.value.postContent || null;
      hasComponentInitiallyLoaded.value = true;
    });

    const updateResponse = ref(null);
    const updatePost = async () => {
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

      updateResponse.value = await FeedService.updatePost(post.value.id, form);
      if (updateResponse.value.status === "success") {
        router.push({
          name: "PostSection",
          params: { id: updateResponse.value.data.data.id },
        });
      }
    };
    return {
      user,
      hasComponentInitiallyLoaded,
      postResponse,
      post,
      updatePost,
      oldPostImage,
      postTitle,
      image,
      postContent,
      updateResponse,
    };
  },
};
</script>

<style></style>
