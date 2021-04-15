<template>
  <div class="sort-options row">
    <button
      @click="sortBy('Newest')"
      class="button waves-effect waves-light btn-small blue"
      v-bind:class="{ 'darken-3': currentSort === 'Newest' }"
    >
      Newest
    </button>
    <button
      @click="sortBy('Oldest')"
      class="button waves-effect waves-light btn-small blue"
      v-bind:class="{ 'darken-3': currentSort === 'Oldest' }"
    >
      Oldest
    </button>
    <button
      @click="sortBy('Highest Like Percentage')"
      class="button waves-effect waves-light btn-small blue"
      v-bind:class="{ 'darken-3': currentSort === 'Highest Like Percentage' }"
    >
      Like %
    </button>
    <button
      @click="sortBy('Most Likes')"
      class="button waves-effect waves-light btn-small blue"
      v-bind:class="{ 'darken-3': currentSort === 'Most Likes' }"
    >
      Most Likes
    </button>
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

<style scoped>
.sort-options {
  margin-left: auto;
  margin-right: auto;
  width: 85%;
  position: relative;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffffff;
}
.button {
  margin-right: 10px;
}
</style>
