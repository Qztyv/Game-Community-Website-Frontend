import ProfileService from "./../services/ProfileService.js";
import store from "./../store/index.js";

export default {
  async getLoggedInFollowing(userId) {
    {
      let response = await ProfileService.getUserFollowing(userId);
      if (response.status === "success" && response.data.data.length) {
        return response.data.data[0].following;
      } else {
        store.dispatch("addNotification", {
          type: "error",
          message: "Something went wrong, try reloading again",
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
};
