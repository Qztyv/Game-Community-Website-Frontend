<template>
  <div class="comment">
    <div class="comment-header">
      <span v-if="comment.user !== null">
        <router-link
          :to="{ name: 'UserProfile', params: { userId: comment.user._id } }"
        >
          <span v-if="comment.user.banned">
            <del>{{ comment.user.name }}</del>
          </span>
          <span v-else>
            {{ comment.user.name }}
          </span>
        </router-link>
      </span>
      <span v-else> [deleted] </span>
      {{ generalCreatedAt }}
    </div>
    <div class="comment-content">
      <p>{{ comment.content }}</p>
    </div>
  </div>
</template>

<script>
import getGeneralTimeSinceCreation from "@/utils/getTimeBetweenTwoDates.js";

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const generalCreatedAt = getGeneralTimeSinceCreation(
      Date.now(),
      props.comment.createdAt
    );

    return {
      generalCreatedAt,
    };
  },
};
</script>

<style scoped></style>
