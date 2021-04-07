<template>
  <div class="comment">
    <span v-if="comment.user !== null">
      <router-link
        :to="{ name: 'UserProfile', params: { userId: comment.user._id } }"
      >
        {{ comment.user.name }}
      </router-link>
    </span>
    <span v-else> [deleted] </span>
    {{ generalCreatedAt }}
  </div>
  <p>{{ comment.content }}</p>
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

<style></style>
