<template>
  <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
  <Suspense>
    <template #default>
      <UserCommentFeed :sort="sortBy" :key="sortId" :userId="userId" />
    </template>
    <template #fallback>
      <Loader />
    </template>
  </Suspense>
</template>

<script>
import SortFeedButtons from "@/components/SortFeedButtons";
import UserCommentFeed from "@/components/UserCommentFeed";
import Loader from "@/components/Loader";
import { ref } from "vue";
export default {
  inheritAttrs: false,
  components: {
    SortFeedButtons,
    UserCommentFeed,
    Loader,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const sortId = ref(0);
    const sortBy = ref("-createdAt");
    const updateFeedSortBy = (newSortBy) => {
      sortBy.value = newSortBy;
      sortId.value++;
    };
    return {
      sortId,
      sortBy,
      updateFeedSortBy,
    };
  },
};
</script>

<style scoped></style>
