<template>
  <div v-if="response">
    {{ response.message }}
  </div>
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
</template>

<script>
import { useRouter } from "vue-router";
import FeedService from "@/services/FeedService";
import { ref } from "vue";

export default {
  setup() {
    const router = useRouter();

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

    return {
      postTitle,
      image,
      postContent,
      addPost,
      response,
    };
  },
};
</script>

<style></style>
