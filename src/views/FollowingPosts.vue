<template>
  <PageBanner>
    <template v-slot:title>Following Feed</template>
    <template v-slot:description>
      All posts from users you currently follow are shown here!
    </template>
  </PageBanner>
  <div id="following-feed">
    <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
    <div>
      <Suspense>
        <template #default>
          <PostFeed :sort="sortBy" :key="sortId" feedType="Following" />
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
