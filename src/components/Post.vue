<template>
  <p>{{ post.user.name }}</p>
  <p>{{ post.createdAt }}</p>
  <h1>{{ post.postTitle }}</h1>
  <p>{{ post.postContent }}</p>
  <p>likes: {{ post.likes }}</p>
  <p>dislikes: {{ post.dislikes }}</p>
  <p>comments: {{ post.comments }}</p>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
