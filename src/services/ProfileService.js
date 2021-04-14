import apiClient from "./apiClient";
import handleServiceErrors from "./../utils/handleServiceErrors";

export default {
  async getUserFollowing(userId) {
    let response;
    try {
      response = await apiClient.get(`users/${userId}/following`);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getUserFollowers(userId) {
    let response;
    try {
      response = await apiClient.get(`users/${userId}/followers`);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async addFollowingToLoggedInUser(profileUserId) {
    let response;
    try {
      response = await apiClient.patch(
        `following/addFollowing/${profileUserId}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async removeFollowingFromLoggedInUser(profileUserId) {
    let response;
    try {
      response = await apiClient.delete(
        `following/removeFollowing/${profileUserId}`
      );
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async removeFollowerFromLoggedInUser(profileUserId) {
    let response;
    try {
      response = await apiClient.delete(
        `followers/removeFollower/${profileUserId}`
      );
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async banUser(UserId, banForm) {
    let response;
    try {
      response = await apiClient.patch(`users/${UserId}/ban`, banForm);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async unbanUser(UserId) {
    let response;
    try {
      response = await apiClient.patch(`users/${UserId}/unban`);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
};
