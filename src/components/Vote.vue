<template>
  <div id="error" v-if="response">
    {{ response.message }}
  </div>
  <button
    class="button waves-effect waves-light btn-small blue-grey"
    @click.prevent="
      direction === 1
        ? setVoteDirection(0, direction)
        : setVoteDirection(1, direction)
    "
  >
    <i
      class="material-icons left"
      v-bind:class="{ 'icon-blue': direction === 1 }"
      >thumb_up</i
    >
    {{ likes }}
  </button>
  <button
    class="button waves-effect waves-light btn-small blue-grey"
    @click.prevent="
      direction === -1
        ? setVoteDirection(0, direction)
        : setVoteDirection(-1, direction)
    "
  >
    <i
      class="material-icons left"
      v-bind:class="{ 'icon-blue': direction === -1 }"
      >thumb_down</i
    >
    {{ dislikes }}
  </button>
</template>

<script>
import { onBeforeMount, ref } from "vue";
import FeedService from "@/services/FeedService.js";

export default {
  props: {
    document: {
      type: Object,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const likes = ref(props.document.likes || 0);
    const dislikes = ref(props.document.dislikes || 0);

    let doesVoteAlreadyExist = null;
    const setVoteFlagIfUserIsLoggedIn = () => {
      // Users that are logged in have another property called voteList, and it contains their vote (1 element) if they voted
      // if they have not voted, it is an empty array.
      if (props.document.voteList) {
        doesVoteAlreadyExist = props.document.voteList.length !== 0;
      }
    };

    const direction = ref(null);

    onBeforeMount(() => {
      setVoteFlagIfUserIsLoggedIn();
      if (doesVoteAlreadyExist) {
        direction.value = props.document.voteList[0].direction; // 1 - like, 0 - updated to neutral, -1 dislike
      }
    });

    let processingVote = false;
    let newVoteId = null;
    const response = ref(null);
    const setVoteDirection = async (newDirection, directionBeforeChange) => {
      if (!processingVote) {
        processingVote = true;
        if (!doesVoteAlreadyExist) {
          // logged in users who have never voted on this document before fall here. Also logged out users who try to create
          // a vote by liking or disliking will be sent here - they will fail authentication and be redirected to login
          await createDocumentVote(newDirection, directionBeforeChange);
        } else {
          // if a vote already exists on the document (matching user id and document id), users fall into here
          await updateDocumentVote(newDirection, directionBeforeChange);
        }
        processingVote = false;
      }
    };
    const createDocumentVote = async (newDirection, directionBeforeChange) => {
      response.value = await FeedService.createDocumentVote(
        props.document.id,
        props.documentType,
        {
          direction: newDirection,
        }
      );
      if (response.value.status === "success") {
        doesVoteAlreadyExist = true;
        setCountersAndNewLikeId(newDirection, directionBeforeChange, response);
      }
    };

    const updateDocumentVote = async (newDirection, directionBeforeChange) => {
      let voteId = getVoteId();
      response.value = await FeedService.updateDocumentVote(
        voteId,
        props.documentType,
        {
          direction: newDirection,
        }
      );
      if (response.value.status === "success") {
        setCountersAndNewLikeId(newDirection, directionBeforeChange, response);
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
        voteId = props.document.voteList[0].id;
      } else {
        voteId = newVoteId;
      }
      return voteId;
    };

    return {
      likes,
      dislikes,
      direction,
      response,
      setVoteDirection,
    };
  },
};
</script>

<style scoped>
.btn-small {
  height: 25px;
  line-height: 25px;
  font-size: 11px;
}
.button {
  margin-left: 5px;
}
i.left {
  margin-right: 5px;
}

i.icon-blue {
  color: #3ea6ff;
}
</style>
