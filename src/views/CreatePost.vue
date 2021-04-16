<template>
  <PageBanner>
    <template v-slot:title>Create Post</template>
    <template v-slot:description
      >Lets create a post! Titles are required, images and text context is
      optional</template
    >
  </PageBanner>
  <form @submit.prevent="addPost">
    <div v-if="response?.message" class="white-text card-panel red">
      <span>{{ response.message }}</span>
    </div>
    <div class="card-panel">
      <div class="input-wrapper">
        <label for="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="Title"
          v-model="postTitle"
          minlength="1"
          maxlength="300"
          class="validate"
          required
        />
      </div>
      <img
        v-if="previewImage"
        :src="previewImage"
        alt="Post Image"
        class="responsive-img z-depth-2"
      />
      <div class="input-wrapper">
        <label for="image">Select Post Image (optional):</label>
        <input
          type="file"
          @change="onFileChange"
          accept="image/*"
          id="image"
          name="image"
        />
        <button
          v-if="previewImage"
          @click="removeImage"
          class="waves-effect waves-light btn-small red lighten-2"
        >
          Remove image
        </button>
      </div>
      <div class="input-wrapper">
        <label for="postContent">Post Text Content:</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          placeholder="Text (optional)"
          v-model="postContent"
          maxlength="3000"
          class="materialize-textarea"
        />
      </div>
      <button
        type="submit"
        class="waves-effect waves-light btn-small blue-grey lighten-1"
      >
        Add Post
      </button>
    </div>
  </form>
</template>

<script>
import { useRouter } from "vue-router";
import FeedService from "@/services/FeedService";
import { ref } from "vue";
import PageBanner from "@/components/PageBanner";
export default {
  components: {
    PageBanner,
  },
  setup() {
    const router = useRouter();

    const previewImage = ref(null);

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

    let fileObject = null;

    const onFileChange = (e) => {
      if (e.target.files[0]) {
        image.value = e.target.files[0];
        fileObject = e;
        if (image.value) {
          // preview the image before upload
          previewImage.value = URL.createObjectURL(image.value);
        }
      }
    };

    const removeImage = () => {
      image.value = null;
      previewImage.value = null;
      if (fileObject) {
        fileObject.target.value = "";
      }
    };

    return {
      previewImage,
      postTitle,
      image,
      postContent,
      addPost,
      response,
      onFileChange,
      removeImage,
    };
  },
};
</script>

<style></style>
