<template>
  <div v-if="response">
    {{ response.message }}
  </div>
  <p>
    Posted by
    <router-link
      :to="{ name: 'UserProfile', params: { userId: post.user._id } }"
    >
      {{ post.user.name }}
    </router-link>
    {{ generalCreatedAt }}
  </p>
  <h1>{{ post.postTitle }}</h1>
  <p>{{ post.postContent }}</p>
  <button
    @click="
      direction === 1
        ? setVoteDirection(0, direction)
        : setVoteDirection(1, direction)
    "
  >
    likes: {{ likes }}
  </button>
  <p v-if="direction === 1">You have liked this post</p>
  <button
    @click="
      direction === -1
        ? setVoteDirection(0, direction)
        : setVoteDirection(-1, direction)
    "
  >
    dislikes: {{ dislikes }}
  </button>
  <p v-if="direction === -1">You have disliked this post</p>
  <p>comments: {{ post.comments }}</p>
</template>

<script>
import { onBeforeMount, ref } from "vue";
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
    const dislikes = ref(props.post.dislikes);

    let doesVoteAlreadyExist = null;
    const setVoteFlagIfUserIsLoggedIn = () => {
      // Users that are logged in have another property called voteList, and it contains their vote (1 element) if they voted
      // if they have not voted, it is an empty array.
      if (props.post.voteList) {
        doesVoteAlreadyExist = props.post.voteList.length !== 0;
      }
    };

    const direction = ref(null);

    onBeforeMount(() => {
      setVoteFlagIfUserIsLoggedIn();
      if (doesVoteAlreadyExist) {
        direction.value = props.post.voteList[0].direction; // 1 - like, 0 - updated to neutral, -1 dislike
      }
    });

    let newVoteId = null;
    const response = ref(null);
    const setVoteDirection = async (val, directionBeforeChange) => {
      if (!doesVoteAlreadyExist) {
        // logged in users who have never voted on this post before fall here. Also logged out users who try to create
        // a vote by liking or disliking will be sent here - they will fail authentication and be redirected to login
        await createVote(val, directionBeforeChange);
      } else {
        // if a vote already exists on the post (matching user id and post id), users fall into here
        await updateVote(val, directionBeforeChange);
      }
    };
    const createVote = async (val, directionBeforeChange) => {
      response.value = await FeedService.createVote(props.post.id, {
        direction: val,
      });
      if (response.value.status === "success") {
        doesVoteAlreadyExist = true;
        setCountersAndNewLikeId(val, directionBeforeChange, response);
      }
    };
    const updateVote = async (val, directionBeforeChange) => {
      let voteId = getVoteId();
      response.value = await FeedService.updateVote(voteId, {
        direction: val,
      });
      if (response.value.status === "success") {
        setCountersAndNewLikeId(val, directionBeforeChange, response);
      }
    };

    const setCountersAndNewLikeId = (
      newDirection,
      directionBeforeChange,
      response
    ) => {
      if (newDirection === 1) likes.value++;
      if (newDirection === -1) dislikes.value++;
      if (directionBeforeChange === -1) dislikes.value--;
      if (directionBeforeChange === 1) likes.value--;
      direction.value = newDirection;
      newVoteId = response.value.data.data.id;
    };

    const getVoteId = () => {
      let voteId;
      if (newVoteId === null) {
        voteId = props.post.voteList[0].id;
      } else {
        voteId = newVoteId;
      }
      return voteId;
    };

    return {
      generalCreatedAt,
      likes,
      dislikes,
      direction,
      response,
      setVoteDirection,
    };
  },
};
</script>

<style></style>
