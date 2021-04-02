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
};
