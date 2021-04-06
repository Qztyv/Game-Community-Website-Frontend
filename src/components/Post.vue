<template>
  <div class="header">
    Posted by
    <span v-if="post.user !== null">
      <router-link
        :to="{ name: 'UserProfile', params: { userId: post.user._id } }"
      >
        {{ post.user.name }}
      </router-link>
      {{ generalCreatedAt }}
    </span>
    <span v-else> [deleted] </span>
  </div>
  <div class="content">
    <h1>{{ post.postTitle }}</h1>
    <p>{{ post.postContent }}</p>
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

<style></style>
