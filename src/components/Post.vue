<template>
  <div class="post">
    <div class="post-header white-text card-panel blue-grey darken-1">
      Posted by
      <span v-if="post.user !== null" class="user-name">
        <router-link
          :to="{ name: 'UserProfile', params: { userId: post.user._id } }"
        >
          <span v-if="post.user.banned">
            <i>
              <del>{{ post.user.name }}</del>
            </i>
          </span>
          <span v-else>
            <i>
              {{ post.user.name }}
            </i>
          </span>
          <img
            :src="
              post.user.photo
                ? post.user.photo
                : require('@/assets/default_profile_image.png')
            "
            alt="Profile Photo"
            width="25"
            height="25"
            class="profile-image"
          />
        </router-link>
      </span>
      <span v-else> [deleted] </span>
      {{ generalCreatedAt }}
    </div>
    <div class="post-content">
      <h4
        class="post-content-title"
        v-bind:class="{ 'title-line': post.image || post.postContent }"
      >
        {{ post.postTitle }}
      </h4>
      <div class="post-image" v-if="post.image">
        <!-- could make image responsive with materialize -->
        <img
          :src="post.image"
          alt="Post Image"
          class="responsive-img z-depth-2"
        />
      </div>
      <div
        v-if="post.postContent"
        class="post-content-text"
        v-html="post.postContent"
      ></div>
    </div>
    <div class="options">
      <Vote :document="post" documentType="post" />
      <button
        class="button waves-effect waves-light btn-small blue-grey lighten-1"
      >
        <i class="material-icons left">mode_comment</i>{{ post.comments }}
        {{ post.comments === 1 ? "comment" : "comments" }}
      </button>
    </div>
  </div>
</template>

<script>
import getGeneralTimeSinceCreation from "@/utils/getTimeBetweenTwoDates.js";
import Vote from "@/components/Vote";
import { onMounted } from "vue";
export default {
  components: {
    Vote,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const generalCreatedAt = getGeneralTimeSinceCreation(
      Date.now(),
      props.post.createdAt
    );

    onMounted(() => {
      // tinyMCE make it awkward to make videos responsive on the free version, so this is a workaround to make the
      // iframes responsive
      let iframes = document.body.getElementsByTagName("iframe");

      for (let iframe of iframes) {
        iframe.attributes.width.value = "100%";
        // want to change the height depending on small monitor / phone users
        if (document.body.clientWidth > 700) {
          iframe.attributes.height.value = "520px";
        } else {
          iframe.attributes.height.value = "270px";
        }
      }

      // workaround to get bold-text to work. Couldnt override strong font-weight in css, or anywhere else. Seems to only
      // be possible after the raw html has been rendered. I think the strong bug issue is caused by materializecss messing
      // with tinyMCE.
      let boldText = document.body.getElementsByTagName("strong");
      for (let text of boldText) {
        text.style.fontWeight = "550";
      }
    });

    return {
      generalCreatedAt,
    };
  },
};
</script>

<style scoped>
.profile-image {
  margin-left: 5px;
}

.post {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  width: 50%;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
}

@media only screen and (max-width: 992px) {
  .post {
    width: 80%;
  }
}
.post-header {
  border-radius: 0px;
  text-align: left;
  margin: 0px;
}

.post-content {
  text-align: left;
}

.post-content-title {
  padding-bottom: 6px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}

.title-line {
  border-bottom: 1px solid #dfdfdd;
}

.post-image {
  text-align: center;
}

.responsive-img {
  max-height: 520px;
  text-align: center;
}

.post-content-text {
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 10px;
}

.user-name:hover {
  text-decoration: underline;
}
a {
  color: white;
}

.options {
  margin-top: 10px;
  margin-bottom: 2px;
}
.btn-small {
  height: 25px;
  line-height: 25px;
  font-size: 11px;
}
.button {
  margin-left: 5px;
}

i.left {
  margin-right: 5px;
}

.card-panel {
  padding: 18px 18px 18px 10px;
}
</style>
