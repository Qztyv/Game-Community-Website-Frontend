import apiClient from "./apiClient";
import handleServiceErrors from "./../utils/handleServiceErrors";

export default {
  async getAllPosts(limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `posts?limit=${limit}&page=${page}&sort=${sort}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async createPost(postForm) {
    let response;
    try {
      response = await apiClient.post("posts", postForm);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getPost(postId) {
    let response;
    try {
      response = await apiClient.get(`posts/${postId}`);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async createVote(postId, directionVal) {
    let response;
    try {
      response = await apiClient.post(`posts/${postId}/votes`, directionVal);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async updateVote(voteId, directionVal) {
    let response;
    try {
      response = await apiClient.patch(`votes/${voteId}`, directionVal);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async getAllCommentsOnPost(postId, limit, page, sort) {
    let response;
    try {
      response = await apiClient.get(
        `/posts/${postId}/comments?limit=${limit}&page=${page}&sort=${sort}`
      );
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
  async addCommentOnPost(postId, commentForm) {
    let response;
    try {
      response = await apiClient.post(`/posts/${postId}/comments`, commentForm);
      response = response.data;
    } catch (err) {
      response = handleServiceErrors(err);
    }
    return response;
  },
};
