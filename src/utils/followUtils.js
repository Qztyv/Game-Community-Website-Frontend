import ProfileService from "./../services/ProfileService.js";
import store from "./../store/index.js";

export default {
  async getLoggedInFollowing(userId) {
    {
      let response = await ProfileService.getUserFollowing(userId);
      if (response.status === "success") {
        return response.data.data[0]?.following;
      } else {
        store.dispatch("addNotification", {
          type: "error",
          message: "Error: " + response.message,
        });
      }
      return [];
    }
  },
  async appendIsBeingFollowedProperty(
    profileFollowArray,
    loggedInFollowingArray
  ) {
    for (let i = 0; i < profileFollowArray.length; i++) {
      for (let y = 0; y < loggedInFollowingArray.length; y++) {
        if (profileFollowArray[i]._id === loggedInFollowingArray[y]._id) {
          profileFollowArray[i].isBeingFollowed = true;
        }
      }
    }
  },
  async addFollowing(array, index, context, profileUserId, loggedInUserId) {
    const userToFollow = array[index];
    let response = await ProfileService.addFollowingToLoggedInUser(
      userToFollow._id
    );
    if (response.status === "success") {
      array[index].isBeingFollowed = true;
      // if user on their own profile refollowing unfollowed people, we want the counter to reflect that
      if (profileUserId === loggedInUserId) {
        context.emit("incrementFollowingCounter");
      }
    } else {
      store.dispatch("addNotification", {
        type: "error",
        message: "Error: " + response.message,
      });
    }
  },
  async removeFollowing(array, index, context, profileUserId, loggedInUserId) {
    const userToUnfollow = array[index];
    let response = await ProfileService.removeFollowingFromLoggedInUser(
      userToUnfollow._id
    );
    if (response.status === 204) {
      array[index].isBeingFollowed = false;
      // if user on their own profile unfollowing people, we want the counter to reflect that
      if (profileUserId === loggedInUserId) {
        context.emit("decrementFollowingCounter");
      }
    } else {
      store.dispatch("addNotification", {
        type: "error",
        message: "Error: " + response.message,
      });
    }
  },
  async removeFollower(array, index, context) {
    const followerToRemove = array[index];
    let response = await ProfileService.removeFollowerFromLoggedInUser(
      followerToRemove._id
    );
    if (response.status === 204) {
      // remove the follower from the list, and decrement the counter to represent that
      array.splice(index, 1);
      context.emit("decrementFollowerCounter");
    } else {
      store.dispatch("addNotification", {
        type: "error",
        message: "Error: " + response.message,
      });
    }
  },
};
