<template>
  <div class="home">
    <div id="home-feed">
      <h2>Feed of All Posts</h2>
      <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
      <div>
        <Suspense>
          <template #default>
            <PostFeed :sort="sortBy" :key="sortId" feedType="All" />
          </template>
          <template #fallback>
            <Loader />
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import SortFeedButtons from "@/components/SortFeedButtons";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";

export default {
  name: "Home",
  components: {
    SortFeedButtons,
    Loader,
    PostFeed,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.user);

    const sortId = ref(0);
    const sortBy = ref("-createdAt");
    const updateFeedSortBy = (newSortBy) => {
      sortBy.value = newSortBy;
      sortId.value++;
    };
    return {
      user,
      sortId,
      sortBy,
      updateFeedSortBy,
    };
  },
};
</script>
