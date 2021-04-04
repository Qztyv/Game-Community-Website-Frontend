<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <p>
    Posted by
    <router-link
      :to="{ name: 'UserProfile', params: { userId: post.user.id } }"
    >
      {{ post.user.name }}
    </router-link>
    {{ generalCreatedAt }}
  </p>
  <h1>{{ post.postTitle }}</h1>
  <p>{{ post.postContent }}</p>
  <button @click="hasUserLikedPost ? removeLike() : addLike()">
    likes: {{ likes }}
  </button>
  <p v-if="hasUserLikedPost">You have liked this post</p>
  <button @click="addDislike">dislikes: {{ post.dislikes }}</button>
  <p>comments: {{ post.comments }}</p>
</template>

<script>
import { ref } from "vue";
import getGeneralTimeSinceCreation from "@/utils/getTimeBetweenTwoDates.js";
import FeedService from "@/services/FeedService.js";
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const generalCreatedAt = getGeneralTimeSinceCreation(
      Date.now(),
      props.post.createdAt
    );
    const likes = ref(props.post.likes);
    const hasUserLikedPost = ref(props.post.likeList.length !== 0);
    let newLikeId = null;
    const response = ref(null);
    const addLike = async () => {
      response.value = await FeedService.addLike(props.post.id);
      if (response.value.status === "success") {
        likes.value++;
        hasUserLikedPost.value = true;
        newLikeId = response.value.data.data.id;
        console.log("Liked added");
      } else {
        console.log("Error appeared in response.message");
      }
    };
    const removeLike = async () => {
      let id;
      if (newLikeId !== null) {
        id = newLikeId;
      } else {
        id = props.post.likeList[0].id;
      }
      response.value = await FeedService.removeLike(id);
      if (response.value.status === 204) {
        likes.value--;
        hasUserLikedPost.value = false;
        console.log("Liked removed");
      }
    };
    return {
      generalCreatedAt,
      likes,
      hasUserLikedPost,
      response,
      addLike,
      removeLike,
    };
  },
};
</script>

<style></style>
