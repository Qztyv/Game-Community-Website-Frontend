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
      <p v-if="post.postContent" class="post-content-text">
        {{ post.postContent }}
      </p>
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

    return {
      generalCreatedAt,
    };
  },
};
</script>

<style scoped>
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
  padding-left: 10px;
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
  padding: 18px;
}
</style>
