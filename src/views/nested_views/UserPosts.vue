<template>
  <div id="users-posts">
    <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
    <div>
      <Suspense>
        <template #default>
          <PostFeed
            :sort="sortBy"
            :key="sortId"
            feedType="User"
            :userId="userId"
          />
        </template>
        <template #fallback>
          <Loader />
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import SortFeedButtons from "@/components/SortFeedButtons";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";

export default {
  components: {
    SortFeedButtons,
    PostFeed,
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

<style></style>
