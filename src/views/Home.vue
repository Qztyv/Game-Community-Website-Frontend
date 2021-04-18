<template>
  <PageBanner>
    <template v-slot:title>Home Feed</template>
    <template v-slot:description>
      Welcome to the Gaming Hubs' home feed! All gaming related posts made on
      the website are shown here!
    </template>
  </PageBanner>
  <div id="home-feed">
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
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import SortFeedButtons from "@/components/SortFeedButtons";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";
import PageBanner from "@/components/PageBanner";

export default {
  name: "Home",
  components: {
    SortFeedButtons,
    Loader,
    PostFeed,
    PageBanner,
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
