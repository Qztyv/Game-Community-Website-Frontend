import apiClient from "./apiClient";
import handleServiceErrors from "./../utils/handleServiceErrors";

export default {
  async getAllPosts(limit, page) {
    let response;
    try {
      response = await apiClient.get(`posts?limit=${limit}&page=${page}`);
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
};
