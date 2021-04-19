<template>
  <PageBanner>
    <template v-slot:title>Update Post</template>
    <template v-slot:description>Lets update your post!</template>
  </PageBanner>
  <div v-if="hasComponentInitiallyLoaded">
    <div v-if="postResponse?.message" class="white-text card-panel red">
      <span>{{ postResponse.message }}</span>
    </div>
    <div v-if="post" id="post">
      <p v-if="!post.user || user._id !== post.user._id">
        You do not own this post, and so cannot update it!
      </p>
      <div v-else>
        <form @submit.prevent="updatePost">
          <div v-if="updateResponse?.message" class="white-text card-panel red">
            <span>{{ updateResponse.message }}</span>
          </div>
          <div class="card-panel">
            <div class="input-wrapper">
              <label for="postTitle">Update Post Title:</label>
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
              <label for="image">Upload a New Image:</label>
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
              <label for="postContent">Update Text Content:</label>
              <Editor
                id="postContent"
                api-key="ny0ru2fbjm0okc9xjdlur1e71s25bbchq7l0v94cxm5vol0o"
                v-model="postContent"
                :init="{
                  selector: 'textarea#full-featured-non-premium',
                  plugins:
                    'preview paste importcss searchreplace autolink directionality visualblocks visualchars fullscreen image link media charmap hr insertdatetime advlist lists wordcount textpattern noneditable help charmap emoticons',
                  menubar: 'file edit view insert format tools help',
                  toolbar:
                    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | charmap emoticons | fullscreen  preview | image media link | ltr rtl',
                  toolbar_sticky: true,
                  content_css: '//www.tiny.cloud/css/codepen.min.css',
                  toolbar_mode: 'sliding',
                  contextmenu: 'link image imagetools',
                  height: 520,
                  image_class_list: [
                    { title: 'Responsive', value: 'responsive-img z-depth-2' },
                  ],
                }"
              />
            </div>
            <button
              type="submit"
              class="waves-effect waves-light btn-small blue-grey lighten-1"
            >
              Update Post
            </button>
          </div>
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
import PageBanner from "@/components/PageBanner";
import Editor from "@tinymce/tinymce-vue";

export default {
  components: {
    Loader,
    PageBanner,
    Editor,
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
    const previewImage = ref(null);
    // new image
    const image = ref(null);
    const postContent = ref(null);
    onBeforeMount(async () => {
      await getPost();
      postTitle.value = post.value.postTitle;
      previewImage.value = post.value.image;
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

      // if remove image button was pressed, set to empty string to remove on backend
      if (image.value === "remove") {
        form.append("image", "");
        // if a new updated image was selected, add it to form.
      } else if (image.value !== null) {
        form.append("image", image.value);
      }
      // if image is null, we are doing nothing, as we do not want to wipe out the existing
      // image url that is currently in the backend database.

      // When a user updates their content with an empty text box, it is whitespace and so it passes this
      // However, when the user updates a post with an empty chat box to begin with, it is initially null.
      // We do not want to write null to the database, otherwise the word "null" will appear in posts.
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
      image.value = "remove";
      previewImage.value = null;
      if (fileObject) {
        fileObject.target.value = "";
      }
    };

    return {
      user,
      hasComponentInitiallyLoaded,
      postResponse,
      post,
      updatePost,
      previewImage,
      postTitle,
      image,
      postContent,
      updateResponse,
      onFileChange,
      removeImage,
    };
  },
};
</script>

<style scoped>
.responsive-img {
  max-height: 520px;
  text-align: center;
}
form {
  margin-left: auto;
  margin-right: auto;
  width: 60%;
  display: block;
  text-align: left;
}
@media only screen and (max-width: 1300px) {
  form {
    width: 70%;
  }
}

@media only screen and (max-width: 992px) {
  form {
    width: 80%;
  }
}
</style>
