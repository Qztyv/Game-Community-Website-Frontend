<template>
  <div v-if="userResultsResponse?.message" class="white-text card-panel red">
    <span>{{ userResultsResponse.message }}</span>
  </div>
  <PageBanner>
    <template v-slot:title>Search Page</template>
    <template v-slot:description>
      Search through posts or users by name here!
    </template>
  </PageBanner>
  <form @submit.prevent="queryData">
    <div class="search-box-wrapper card-panel blue-grey darken-2">
      <h5 class="header white-text">Select Filter</h5>
      <div class="search-box card-panel">
        <BaseSelect
          :options="['Posts', 'Users']"
          v-model="searchType"
          label="Select Search Type"
        />
        <label for="searchTerm">Enter Search Term</label>
        <input
          type="text"
          id="searchTerm"
          placeholder="search term"
          v-model="searchTerm"
          minlength="1"
          required
        />
        <button
          class="waves-effect waves-light btn-small blue-grey lighten-1"
          type="submit"
        >
          Search
        </button>
      </div>
    </div>
  </form>
  <div class="search-feed-posts" v-if="postSearch">
    <SortFeedButtons @sortBy="updateFeedSortBy($event)" />
    <Suspense>
      <template #default>
        <PostFeed
          :sort="sortBy"
          :key="sortId"
          feedType="searchByTitle"
          :titleSearchTerm="searchTerm"
        />
      </template>
      <template #fallback>
        <Loader />
      </template>
    </Suspense>
  </div>
  <div class="search-feed-users" v-if="userSearch">
    <div v-if="userResults.length > 0">
      <div
        v-for="user in userResults"
        :key="user._id"
        class="user-item card-panel blue-grey darken-1"
      >
        <div class="profile-image-container">
          <img
            :src="
              user.photo
                ? user.photo
                : require('@/assets/default_profile_image.png')
            "
            alt="Profile Photo"
            width="50"
            height="50"
            class="profile-image"
          />
        </div>
        <router-link
          :to="{ name: 'UserProfile', params: { userId: user._id } }"
        >
          <span v-if="user.banned">
            <del>{{ user.name }}</del>
          </span>
          <span v-else>
            {{ user.name }}
          </span>
        </router-link>
      </div>
    </div>
    <p v-else>No users found containing the search term provided :(</p>
  </div>
</template>

<script>
import PageBanner from "@/components/PageBanner";
import BaseSelect from "@/components/BaseSelect";
import SortFeedButtons from "@/components/SortFeedButtons";
import PostFeed from "@/components/PostFeed";
import Loader from "@/components/Loader";
import FeedService from "./../services/FeedService";
import { ref } from "vue";

export default {
  components: {
    PageBanner,
    BaseSelect,
    SortFeedButtons,
    PostFeed,
    Loader,
  },
  setup() {
    const searchType = ref(null);
    const searchTerm = ref(null);

    // using boolean variables to enable / disable portions of template with v-if
    const postSearch = ref(false);
    const userSearch = ref(false);

    // using a variable to increment, this is attached to a component with :key, forcing an update
    // of the component with new data.
    const sortId = ref(0);
    const sortBy = ref("-createdAt");
    const updateFeedSortBy = (newSortBy) => {
      sortBy.value = newSortBy;
      sortId.value++;
    };

    const userResults = ref([]);
    const queryData = async () => {
      postSearch.value = false;
      userSearch.value = false;
      if (searchType.value === "Posts") {
        postSearch.value = true;
        sortId.value++;
      }
      if (searchType.value === "Users") {
        userResults.value = await getUsersFromSearchTermOnName(
          searchTerm.value
        );
        userSearch.value = true;
      }
    };

    const userResultsResponse = ref(null);
    const getUsersFromSearchTermOnName = async (searchTerm) => {
      userResultsResponse.value = await FeedService.getUsersFromSearchTermOnName(
        searchTerm
      );
      if (userResultsResponse.value.status === "success") {
        return userResultsResponse.value.data.data;
      }
      return [];
    };

    return {
      searchType,
      searchTerm,
      postSearch,
      userSearch,
      queryData,
      sortId,
      sortBy,
      updateFeedSortBy,
      userResults,
      userResultsResponse,
    };
  },
};
</script>

<style scoped>
.user-item {
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  border-radius: 4px;
  background-color: #ffffff;
  margin-bottom: 10px;
  padding: 10px;
}

@media only screen and (max-width: 992px) {
  .user-item {
    width: 80%;
  }
}

a {
  color: white;
}

a:hover {
  text-decoration: underline;
}
</style>
