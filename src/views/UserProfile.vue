<template>
  <h1>User profile here: PLACEHOLDER</h1>
  <h2>id: {{ userId }}</h2>
</template>

<script>
export default {
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup() {},
};
</script>

<style></style>
