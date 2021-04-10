<template>
  <div class="sort">
    <p>Sorting by: {{ currentSort }}</p>
    <button @click="sortBy('Newest')">Newest First</button>
    <button @click="sortBy('Oldest')">Oldest First</button>
    <button @click="sortBy('Highest Like Percentage')">Like Percentage</button>
    <button @click="sortBy('Most Likes')">Most Likes</button>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup(props, context) {
    let sort = "-createdAt";
    const currentSort = ref("Newest");

    const sortBy = (option) => {
      if (option === "Newest") {
        sort = "-createdAt";
      }
      if (option === "Oldest") {
        sort = "createdAt";
      }
      if (option === "Highest Like Percentage") {
        sort = "-likePercentage,-likes";
      }
      if (option === "Most Likes") {
        sort = "-likes,dislikes";
      }
      currentSort.value = option;
      context.emit("sortBy", sort);
    };

    return {
      sort,
      currentSort,
      sortBy,
    };
  },
};
</script>

<style></style>
