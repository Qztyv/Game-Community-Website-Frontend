<template>
  <div class="header">
    Posted by
    <span v-if="post.user !== null">
      <router-link
        :to="{ name: 'UserProfile', params: { userId: post.user._id } }"
      >
        <span v-if="post.user.banned">
          <del>{{ post.user.name }}</del>
        </span>
        <span v-else>
          {{ post.user.name }}
        </span>
      </router-link>
    </span>
    <span v-else> [deleted] </span>
    {{ generalCreatedAt }}
  </div>
  <div class="content">
    <h1>{{ post.postTitle }}</h1>
    <div class="post-image" v-if="post.image">
      <!-- could make image responsive with materialize -->
      <img
        :src="post.image"
        alt="Post Image"
        class="responsive-img z-depth-2"
      />
    </div>
    <p v-if="post.postContent">{{ post.postContent }}</p>
  </div>
  <Vote :document="post" documentType="post" />
  <p>comments: {{ post.comments }}</p>
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
.responsive-img {
  max-height: 520px;
}
</style>
